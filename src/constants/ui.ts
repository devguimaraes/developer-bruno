/**
 * UI Constants and utility functions
 */

export const SCROLL_TO_TOP = () => {
  window.scrollTo(0, 0);
};

export const ERROR_MESSAGES = {
  BLOG_LOAD_FAILED: 'Não foi possível carregar os posts do blog. Tente novamente mais tarde.',
  BLOG_POST_LOAD_FAILED: 'Não foi possível carregar o post. Tente novamente mais tarde.',
  GENERIC_ERROR: 'Ocorreu um erro inesperado. Tente novamente mais tarde.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
} as const;

export const ACCESSIBILITY_LABELS = {
  LOADING_POSTS: 'Carregando posts do blog',
  ERROR_LOADING_POSTS: 'Erro ao carregar posts',
  RETRY_BUTTON: 'Tentar carregar posts novamente',
  POST_CARD: {
    READ_MORE: 'Ler mais sobre',
    TAGS: 'Tags do artigo',
    READING_TIME: 'Tempo de leitura',
    PUBLISHED_DATE: 'Data de publicação',
  },
} as const;