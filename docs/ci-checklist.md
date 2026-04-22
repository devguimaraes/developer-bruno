# CI Checklist

Checklist operacional para manter a qualidade local enquanto o GitHub Actions estiver bloqueado por billing.

## Rotina local (antes de commit/PR)

- [ ] Rodar `bun run lint`
- [ ] Rodar `bun run test:unit`
- [ ] Rodar `bun run build`
- [ ] Rodar `bun run test:e2e -- --project=chromium`
- [ ] Verificar `git status` limpo antes do commit
- [ ] Usar Conventional Commits nas mensagens
- [ ] Publicar trabalho na branch `develop`

## Retomada quando billing liberar

- [ ] Abrir **Actions > CI** no GitHub
- [ ] Disparar manualmente via **Run workflow** (branch `develop`)
- [ ] Confirmar execução dos jobs `lint`, `unit`, `build` e `e2e`
- [ ] Se falhar, salvar o link do run para análise
- [ ] Com CI verde em `develop`, seguir com PR de promoção para `main`

## Comandos úteis

```bash
bun run lint
bun run test:unit
bun run build
bun run test:e2e -- --project=chromium
```

