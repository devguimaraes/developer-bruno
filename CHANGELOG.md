# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-12-18

### Added

- Animação glitch permanente no avatar da seção About
- Aplicação de animações hyper-motion em seções restantes
- Melhorias na animação de bio
- Refinamento do parallax no Hero e sequência de bootstrapping do terminal
- Componente Typewriter com variante mecânica e acessibilidade
- Componentes reutilizáveis de movimento e utilitários
- Tokens globais de animação

### Changed

- Atualização de documentação (PHASE1_IMPLEMENTATION, TESTING.md)
- Correção de porta do servidor de desenvolvimento na documentação

---

## [1.1.0] - 2024-12-14

### Added

- **SEO Otimizado**: Meta tags dinâmicas para mercado brasileiro (pt-BR)
- **Structured Data**: Schema.org JSON-LD markup em português
- **Performance Monitoring**: Core Web Vitals com thresholds para redes 3G/4G brasileiras
- **Error Boundaries**: Fallback UX em português com opções de recovery
- **Analytics Privacy-Focused**: Integração Plausible LGPD compliant
- **Sitemap Generation**: XML sitemap automático otimizado para buscadores

### Changed

- Atualizado Vite para v7.2 com SWC
- Atualizado Web Vitals para v5.1
- Melhorias de performance no build com chunk splitting

---

## [1.0.0] - 2024-11-30

### Added

- **Arquitetura de Dados**: 100% externalizada com TypeScript strict
- **Type Definitions**: Interfaces completas para Projects, Experience, Skills
- **Site Configuration**: Metadados e configurações centralizadas
- **Projects Data**: 6 projetos com sistema de tags e filtragem
- **Experience Data**: Timeline profissional com skills e achievements
- **Skills Data**: Competências organizadas por categoria
- **Content Validation**: Schemas Zod para validação runtime
- **Blog System**: Sistema integrado com suporte a markdown
- **Services Section**: Seção de serviços organizada
- **Advanced Navigation**: Scroll-based sections com useStackingSections hook

### Changed

- Hero, Projects, Experience, About, Contact, Footer usando dados externos
- Design brutalist consistente com `border-4` e `--radius: 0rem`

---

## [0.1.0] - 2024-11-01

### Added

- Setup inicial com Gitflow
- Branch `develop` criado
- `CONTRIBUTING.md` com guidelines Gitflow
- `CHANGELOG.md` inicial
