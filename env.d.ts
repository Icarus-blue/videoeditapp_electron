/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string
  // Add other environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}