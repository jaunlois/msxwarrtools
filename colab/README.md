# Colab serving

Wraps the Qwen-3B-Automotive LoRA in a FastAPI shim and tunnels it via ngrok
so the React app at `/consultant` can call it as an OpenAI-compatible endpoint.

## One-time setup (per Colab session)

Open https://colab.research.google.com → **New notebook** → **Runtime → Change
runtime type → T4 GPU**, then paste these three cells.

### Cell 1 — clone + install

```python
!git clone -b develop https://github.com/jaunlois/msxwarrtools.git
%cd msxwarrtools
!pip install -q -r colab/requirements.txt
```

### Cell 2 — load model (~3 min, ~6 GB; run once per session)

```python
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch

MODEL_ID = "Nasim435/Qwen-3B-Automotive-4000"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
)

tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
tokenizer.padding_side = "left"

model = AutoModelForCausalLM.from_pretrained(
    MODEL_ID,
    quantization_config=bnb_config,
    device_map="auto",
    trust_remote_code=True,
)
model.config.pad_token_id = tokenizer.pad_token_id
print("Model loaded.")
```

### Cell 3 — pull latest + run server (re-run after every push)

```python
import os
os.environ["NGROK_AUTHTOKEN"] = "PASTE_YOUR_NGROK_TOKEN"  # https://dashboard.ngrok.com

!cd /content/msxwarrtools && git pull
%run -i colab/serve.py
```

**Note the `-i` flag** — it tells `%run` to use the notebook's namespace so
the script can see `tokenizer` and `model` from Cell 2.

## What you see

Cell 3 prints a public URL. Copy the three values into the warranty app's
`/consultant` page → **Settings**:

```
API Base URL:  https://<id>.ngrok-free.app/v1
Model:         qwen-automotive
API Key:       anything-non-empty
```

## Iterating

When the shim code changes (anything in `colab/serve.py`), just re-run **Cell 3**.
It does `git pull` and `%run -i` — picks up new code, restarts the server,
prints a fresh URL. Cell 2 (the 3-minute model load) does not need to run again.

## Limits to expect

- **ngrok URL rotates** every Colab restart and every ~8 hours on the free tier.
  Update Settings in `/consultant` each time.
- **No tool calling.** The shim ignores `tools` in the request. SLT/CCC/parts
  lookups won't fire; you get conversational replies only.
- **Colab disconnects** after ~12 hours idle. When it dies, the API dies. Re-run
  Cells 1 → 3 to bring it back.
- **CORS is wide open** (`*`). Fine for experiments; tighten before production.
