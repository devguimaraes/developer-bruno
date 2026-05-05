# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-12-18

### Adicionado

- Animação glitch permanente no avatar da seção About
- Aplicação de animações hyper-motion em seções restantes
- Melhorias na animação de bio
- Refinamento do parallax no Hero e sequência de bootstrapping do terminal
- Componente Typewriter com variante mecânica e acessibilidade
- Componentes reutilizáveis de movimento e utilitários
- Tokens globais de animação

### Alterado

- Atualização de documentação (PHASE1_IMPLEMENTATION, TESTING.md)
- Correção de porta do servidor de desenvolvimento na documentação

---

## [1.1.0] - 2024-12-14

### Adicionado

- **SEO Otimizado**: Meta tags dinâmicas para mercado brasileiro (pt-BR)
- **Dados Estruturados**: Schema.org JSON-LD markup em português
- **Monitoramento de Performance**: Core Web Vitals com thresholds para redes 3G/4G brasileiras
- **Limites de Erro**: Fallback UX em português com opções de recovery
- **Analytics Focado em Privacidade**: Integração Plausible LGPD compliant
- **Geração de Sitemap**: XML sitemap automático otimizado para buscadores

### Alterado

- Atualizado Vite para v7.2 com SWC
- Atualizado Web Vitals para v5.1
- Melhorias de performance no build com chunk splitting

---

## [1.0.0] - 2024-11-30

### Adicionado

- **Arquitetura de Dados**: 100% externalizada com TypeScript strict
- **Definições de Tipos**: Interfaces completas para Projects, Experience, Skills
- **Configuração do Site**: Metadados e configurações centralizadas
- **Dados de Projetos**: 6 projetos com sistema de tags e filtragem
- **Dados de Experiência**: Timeline profissional com skills e achievements
- **Dados de Habilidades**: Competências organizadas por categoria
- **Validação de Conteúdo**: Schemas Zod para validação runtime
- **Sistema de Blog**: Sistema integrado com suporte a markdown
- **Seção de Serviços**: Seção de serviços organizada
- **Navegação Avançada**: Seções baseadas em scroll com hook useStackingSections

### Alterado

- Hero, Projects, Experience, About, Contact, Footer usando dados externos
- Design brutalist consistente com `border-4` e `--radius: 0rem`

---

## [0.1.0] - 2024-11-01

### Adicionado

- Setup inicial com Gitflow
- Branch `develop` criado
- `CONTRIBUTING.md` com diretrizes Gitflow
- `CHANGELOG.md` inicial
