// Reference to vite/client removed to prevent "Cannot find type definition file" error

interface ImportMetaEnv {
  readonly API_KEY: string
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}