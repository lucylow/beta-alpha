/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** YouTube video id for hero “Watch demo” embed (optional). */
  readonly VITE_DEMO_VIDEO_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
