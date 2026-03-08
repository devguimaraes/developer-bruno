# Tracker de Execução da Auditoria

Última atualização: 2026-03-08

## Objetivo

Acompanhar a execução das fases da auditoria com foco em:
- Segurança
- Performance
- Manutenibilidade

## Status Geral

- [x] Fase 1 — Hardening crítico de pagamento/download
- [x] Fase 2 — Rate limit distribuído + observabilidade de segurança
- [x] Fase 3 — Performance
- [x] Fase 4 — Manutenibilidade

## Fase 1 — Concluída

- [x] Webhook fail-closed com assinatura obrigatória
- [x] `status_access_token` assinado para `payment-status`
- [x] `download_token` de uso único com expiração
- [x] Ajuste do frontend (`CheckoutModal`) para novo contrato
- [x] Migração SQL para `download_token_expires_at`

Critério de aceite:
- [x] Fluxo de pagamento/download protegido e funcionando

## Fase 2 — Concluída

- [x] Rate limit distribuído via RPC no banco
- [x] Tabela/função SQL para limiter (`edge_rate_limits`, `check_edge_rate_limit`)
- [x] Observabilidade com `logSecurityEvent` e sanitização de dados sensíveis
- [x] CORS centralizado em util compartilhado

Critério de aceite:
- [x] Endpoints críticos sem dependência de limiter em memória local

## Fase 3 — Concluída

Escopo:
- [x] Reduzir custo de render/scroll da home (`useStackingSections` + `Navigation`)
- [x] Melhorar polling do checkout (backoff, timeout, stop conditions)

Checklist técnico:
- [x] Revisar e reduzir thresholds do `IntersectionObserver`
- [x] Evitar múltiplos `setState` por frame em scroll
- [x] Aplicar `throttle`/estratégia mais barata para seção ativa da navbar
- [x] Implementar polling progressivo no checkout (sem `setInterval` fixo de 3s)
- [x] Definir regras de parada do polling (expiração, erro consecutivo, sucesso)

Critério de aceite:
- [x] Menor churn de render durante scroll
- [x] Menos chamadas desnecessárias ao endpoint de status
- [x] Fluxo de checkout resiliente sob latência/falhas

## Fase 4 — Concluída

Escopo:
- [x] Unificar contratos de tipos SEO/StructuredData
- [x] Melhorar pipeline de conteúdo do blog (`content: markdown`, parser e carga)
- [x] Quebrar componentes com excesso de responsabilidade

Critério de aceite:
- [x] Redução de acoplamento e maior previsibilidade para evolução

## Log de Execução

### 2026-03-08
- Fase 1 implementada e validada com lint + testes unitários.
- Fase 2 implementada e validada com lint + testes unitários.
- Review de regressão de tokens legados recebido; sem impacto prático (sem clientes antigos).
- Fase 3 implementada (scroll/render + polling) e validada com lint + testes unitários.
- Fase 4 implementada: tipos SEO/StructuredData centralizados, pipeline de blog modularizado e `StructuredData` decomposto em builder dedicado.
