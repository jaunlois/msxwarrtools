export interface ConsultantSettings {
  baseUrl: string;
  apiKey: string;
  model: string;
}

const KEY = "consultant-settings-v1";

const DEFAULTS: ConsultantSettings = {
  baseUrl: "https://api.openai.com/v1",
  apiKey: "",
  model: "gpt-4o-mini",
};

export function getSettings(): ConsultantSettings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function saveSettings(s: ConsultantSettings) {
  localStorage.setItem(KEY, JSON.stringify(s));
}