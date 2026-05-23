"""
FastAPI shim exposing Qwen-Automotive as an OpenAI-compatible endpoint via ngrok.

Run with: %run -i colab/serve.py

Assumes `tokenizer` and `model` are already defined in the notebook namespace
(load them once per session, then re-run this script as code evolves).

Set ngrok auth before %run for stable tunnels:
    import os; os.environ["NGROK_AUTHTOKEN"] = "..."
"""
import os
import subprocess
import threading
import time
import traceback
import uuid
from typing import Any, Dict, List, Optional

# --- Reset prior state from earlier %run -----------------------------------
subprocess.run(["fuser", "-k", "8000/tcp"], capture_output=True)
subprocess.run(["pkill", "-9", "-f", "ngrok"], capture_output=True)
time.sleep(1)

# --- Pick up notebook's tokenizer/model -----------------------------------
try:
    from IPython import get_ipython
    _nb_ns = get_ipython().user_ns
except Exception:
    _nb_ns = globals()

tokenizer = _nb_ns.get("tokenizer")
model = _nb_ns.get("model")
if tokenizer is None or model is None:
    raise RuntimeError(
        "Load `tokenizer` and `model` in a prior cell before running this. "
        "See colab/README.md."
    )

# --- Imports that need the venv from requirements.txt ---------------------
import nest_asyncio
import torch
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pyngrok import conf, ngrok

nest_asyncio.apply()

# --- API -------------------------------------------------------------------
app = FastAPI(title="Qwen-Automotive Shim")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_call_id: Optional[str] = None
    name: Optional[str] = None


class ChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.3
    max_tokens: Optional[int] = 400
    tools: Optional[List[Dict[str, Any]]] = None
    tool_choice: Optional[Any] = None


@app.exception_handler(Exception)
async def all_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    print("\n" + "!" * 60)
    print(f"ERROR @ {request.method} {request.url.path}")
    print(tb)
    print("!" * 60 + "\n")
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "type": type(exc).__name__,
                "message": str(exc),
                "tail": tb.strip().splitlines()[-12:],
            }
        },
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )


@app.get("/")
def root():
    return {"ok": True, "service": "qwen-automotive"}


@app.get("/v1/models")
def list_models():
    return {
        "object": "list",
        "data": [{"id": "qwen-automotive", "object": "model", "owned_by": "local"}],
    }


@app.post("/v1/chat/completions")
def chat_completions(req: ChatRequest):
    msgs: List[Dict[str, str]] = []
    for m in req.messages:
        if m.role in ("system", "user", "assistant"):
            msgs.append({"role": m.role, "content": m.content or ""})
        elif m.role == "tool":
            msgs.append({
                "role": "user",
                "content": f"(tool result from {m.name or '?'}): {m.content or ''}",
            })

    text = tokenizer.apply_chat_template(
        msgs, tokenize=False, add_generation_prompt=True
    )
    inputs = tokenizer(
        text, return_tensors="pt", return_attention_mask=True
    ).to(model.device)

    with torch.no_grad():
        out = model.generate(
            input_ids=inputs.input_ids,
            attention_mask=inputs.attention_mask,
            max_new_tokens=req.max_tokens or 400,
            temperature=req.temperature or 0.3,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.pad_token_id,
            eos_token_id=tokenizer.eos_token_id,
        )

    reply = tokenizer.decode(
        out[0][inputs.input_ids.shape[1]:], skip_special_tokens=True
    ).strip()

    return {
        "id": f"chatcmpl-{uuid.uuid4().hex[:24]}",
        "object": "chat.completion",
        "created": int(time.time()),
        "model": req.model,
        "choices": [{
            "index": 0,
            "message": {"role": "assistant", "content": reply},
            "finish_reason": "stop",
        }],
        "usage": {
            "prompt_tokens": int(inputs.input_ids.shape[1]),
            "completion_tokens": int(out.shape[1] - inputs.input_ids.shape[1]),
            "total_tokens": int(out.shape[1]),
        },
    }


# --- ngrok tunnel ----------------------------------------------------------
authtoken = os.environ.get("NGROK_AUTHTOKEN", "").strip()
if authtoken:
    conf.get_default().auth_token = authtoken
else:
    print("WARN: NGROK_AUTHTOKEN not set; tunnel expires in ~2 hours.")
    print("      Get one free at https://dashboard.ngrok.com and set it before %run:")
    print("        import os; os.environ['NGROK_AUTHTOKEN'] = '...'")

for t in ngrok.get_tunnels():
    try:
        ngrok.disconnect(t.public_url)
    except Exception:
        pass

tunnel = ngrok.connect(8000, "http")
public_url = tunnel.public_url


# --- Run server in background thread --------------------------------------
def _run_uvicorn():
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="warning")


threading.Thread(target=_run_uvicorn, daemon=True).start()
time.sleep(2)

print("\n" + "=" * 64)
print(f" Public URL:   {public_url}")
print(f"")
print(f" Paste into /consultant Settings on your Render app:")
print(f"   API Base URL: {public_url}/v1")
print(f"   Model:        qwen-automotive")
print(f"   API Key:      anything-non-empty")
print("=" * 64 + "\n")
