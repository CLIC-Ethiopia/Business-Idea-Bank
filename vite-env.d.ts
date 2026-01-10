// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly API_KEY: string
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly GOOGLE_SEARCH_API_KEY: string
  readonly GOOGLE_SEARCH_CX: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_ANON_KEY?: string;
    GOOGLE_SEARCH_API_KEY?: string;
    GOOGLE_SEARCH_CX?: string;
  }
}
