---
title: "Otimizando React: Além do básico"
date: "10 NOV 2023"
readTime: "8 min"
tags: ["React", "Dev", "Performance"]
excerpt: "useMemo não é bala de prata. Entenda renderização, keys e virtualização para interfaces realmente fluidas."
---

# Performance Real em React

Muitos desenvolvedores espalham `useMemo` e `useCallback` pelo código como se fosse tempero, esperando que o app fique mágico. Spoiler: **não fica**.

## O verdadeiro vilão: Re-renders Desnecessários

O React é rápido, mas renderizar componentes pesados 50 vezes por segundo trava qualquer navegador.

### 1. Estrutura de Estado
O erro número 1 é colocar estado global onde estado local resolveria. Se apenas um botão muda de cor, por que a página inteira está renderizando?

### 2. Listas Longas
Se você está renderizando uma lista com mais de 100 itens, você precisa de **virtualização**.

Bibliotecas recomendadas:
* `react-window`
* `virtua`

### 3. Imagens
Use formatos modernos (WebP, AVIF) e carregamento preguiçoso (`lazy loading`).

```jsx
<img
  src="foto-pesada.webp"
  loading="lazy"
  alt="Otimização"
/>
```

Performance é UX. Ninguém gosta de esperar.