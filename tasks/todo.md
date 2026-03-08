# TODO: Implementação de Melhorias de Auditoria

## 🔴 Fase 1 - Critical

- [x] Sanear Vulnerabilidades npm (resolvido com `npm audit fix`)
- [x] Validar Políticas RLS de tabelas no Supabase (Bloquear insert/select desnecessário pela VITE_SUPABASE_ANON_KEY)

## 🟡 Fase 2 - Important

- [x] Iniciar testes E2E básicos com Playwright (formulário de contato principal).
- [x] Adicionar testes unitários em `src/lib/` ou utilitários via Vitest.
- [x] Configuração de validação estrita pré-commit para Linter e Typescript (husky/lint-staged).

## 🟢 Fase 3 - Nice to have

- [x] Melhorar cache config no queryClient (React Query Stale Time).
- [ ] Integrações/Melhorias gerais pendentes.
