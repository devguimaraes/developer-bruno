/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY?: string;
  /** Token pessoal do GitHub, lido só no build de /sobre para o calendário de contribuições. */
  readonly GITHUB_CONTRIBUTIONS_TOKEN?: string;
}
