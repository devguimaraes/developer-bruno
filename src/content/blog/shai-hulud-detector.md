---
title: "Shai-Hulud 2 Detector TS: Proteja seu Projeto NPM"
date: "25 NOV 2025"
readTime: "4 min"
tags: ["Segurança", "NPM", "TypeScript", "Scripts"]
excerpt: "Um script TypeScript para detectar pacotes comprometidos pelo ataque Shai-Hulud 2.0 em projetos Node.js."
---

# Shai-Hulud 2 Detector TS: Proteja seu Projeto NPM 🛡️

Recentemente, um novo ataque à cadeia de suprimentos NPM, apelidado de **Shai-Hulud 2.0**, foi identificado. Este ataque visa comprometer projetos Node.js através de dependências maliciosas.

Para ajudar a comunidade a se proteger, foi desenvolvido o script **Shai-Hulud 2 Detector TS**, uma ferramenta simples e eficaz para verificar se o seu projeto contém algum pacote comprometido.

## 🚨 O que é o ataque Shai-Hulud 2.0?

O ataque envolve a publicação de pacotes NPM maliciosos que se passam por bibliotecas populares ou dependências internas de grandes empresas. Uma vez instalados, esses pacotes podem executar código arbitrário, roubar credenciais ou abrir backdoors em seus sistemas.

## 🛠️ O Script Detector

O script `shai-hulud-2-detector-ts` verifica as dependências do seu projeto (tanto no `package.json` quanto nos arquivos de lock `package-lock.json`, `pnpm-lock.yaml` ou `yarn.lock`) contra uma lista conhecida de pacotes comprometidos.

### Características

- **Suporte Multi-Gerenciador**: Funciona com NPM, Yarn e PNPM.
- **Verificação Profunda**: Analisa dependências diretas e transitivas através dos arquivos de lock.
- **TypeScript**: Escrito em TypeScript para segurança e clareza.
- **Execução via Bun**: Otimizado para rodar rapidamente com o runtime Bun.

## 🚀 Como Usar

Você pode usar o script diretamente em seu projeto. Aqui está o passo a passo:

### 1. Instale o Bun

Se ainda não tiver, instale o [Bun](https://bun.sh), um runtime JavaScript all-in-one rápido.

### 2. Baixe o Script

Baixe o arquivo do script para a raiz do seu projeto (onde está o `package.json`).

### 3. Execute a Verificação

Rode o comando:

```bash
bun shai-hulud-2-detector.ts
```

O script irá analisar seus arquivos e reportar se encontrar qualquer pacote suspeito.

## 📦 Código Fonte

O script completo está disponível e é open-source. Ele verifica uma lista de pacotes comprometidos, como `@accordproject/concerto-analysis`, `@posthog/agent`, entre outros.

Aqui está um trecho de como ele funciona:

```typescript
// Full list of compromised packages from Shai-Hulud 2.0 supply chain attack
const COMPROMISED_PACKAGES: Array<PackageEntry> = [
  { name: '@accordproject/concerto-analysis', version: '3.24.1' },
  { name: '@posthog/agent', version: '1.24.1' },
  // ... outros pacotes
];

function main() {
  const { path: pkgPath, content: pkg, projectDir } = loadPackageJson()
  console.log(`📦 Checking: ${pkgPath}`)
  
  // ... lógica de verificação
}
```

## 🛡️ Medidas Recomendadas

Se o script detectar pacotes comprometidos:

1. **Remova `node_modules`**: Delete a pasta `node_modules`.
2. **Limpe o Cache**: Execute `npm cache clean --force` (ou equivalente).
3. **Fixe Versões**: Use versões exatas no `package.json` para evitar atualizações automáticas para versões maliciosas.
4. **Regere o Lockfile**: Delete o arquivo de lock e instale as dependências novamente.
5. **Rotacione Segredos**: Por precaução, troque tokens e chaves de API que possam ter sido expostos.

Mantenha seus projetos seguros! 🔒

---
*Fonte e Script Original: [O Codista - Shai-Hulud 2 Detector TS](https://ocodista.com/br/scripts/shai-hulud-2-detector-ts)*
