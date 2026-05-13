/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LAST_UPDATED: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
