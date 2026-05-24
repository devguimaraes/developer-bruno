# Social Icons na Seção LET'S_TALK

**Data:** 2026-05-24
**Estado:** Aguardando revisão

## Contexto

A seção "LET'S_TALK" no final da homepage (`Index.tsx`) precisa exibir ícones das redes sociais do desenvolvedor (Instagram, GitHub, LinkedIn, X) com o mesmo padrão visual da seção de social links do `Contact.tsx`.

## Escopo

### O que será feito

- Adicionar a rede X ao `contactData.socialLinks` em `src/config/site.ts`
- Adicionar o pacote `simple-icons` como dependência para ícones SVG oficiais das marcas
- Criar `src/components/SocialIcons.tsx` — componente reutilizável com ícones em linha horizontal
- Integrar `<SocialIcons />` na seção contact do `Index.tsx` entre o LET'S_TALK e o copyright

### O que NÃO será feito

- Não modificar `Contact.tsx` (sem refatoração do existente)
- Não adicionar outras redes sociais além das 4 listadas
- Não alterar o estilo ou layout da seção Contact existente

## Design

### 1. Dados — `src/config/site.ts`

Adicionar X ao array `contactData.socialLinks`:

```typescript
{
  id: 'x',
  href: 'https://x.com/devguimraes/',
  label: 'X',
  username: 'devguimraes',
}
```

Os demais links já existem no array: LinkedIn (`bcguimaraes`), GitHub (`devguimaraes`), Instagram (`dev.guimaraes`).

O campo `icon: LucideIcon` será descontinuado — o componente usará `simple-icons` diretamente.

### 2. Componente — `src/components/SocialIcons.tsx`

**Props:** Nenhuma. Lê de `contactData.socialLinks` diretamente.

**Comportamento (padrão Contact.tsx):**
- Ícones SVG das marcas via `simple-icons` (imports nomeados: `siGithub`, `siLinkedin`, `siInstagram`, `siX`)
- Cada link é um `<a target="_blank" rel="noreferrer">` com:
  - Índice numérico (`01`–`04`) em `type-ui-label`
  - Ícone da marca renderizado como `<svg viewBox="0 0 24 24">` com `<path d={icon.path} />`
  - Estilo outline: cor inicial `white/60` ou equivalente, borda sutil
  - `ArrowUpRight` do Lucide que aparece no hover com slide-up
- Disposição horizontal com `flex` e `gap`
- Separador visual entre ícones (`border-b` ou similar)
- Cada ícone envolto em `ScrollReveal` com stagger de `0.1s` por índice
- Hover: cor do texto/ícone transiciona para `accent` (Freesia gold), borda escurece

### 3. Ícones — `simple-icons`

Pacote: [`simple-icons`](https://www.npmjs.com/package/simple-icons) (~12.5KB gzipped total, tree-shaking remove o que não for usado).

Cada ícone expõe:
- `path`: string do path SVG
- `hex`: cor oficial da marca (usado opcionalmente no hover)

```typescript
import { siGithub, siLinkedin, siInstagram, siX } from "simple-icons";

const iconMap: Record<string, { path: string; hex: string }> = {
  github: siGithub,
  linkedin: siLinkedin,
  instagram: siInstagram,
  x: siX,
};
```

### 4. Integração — `src/components/pages/Index.tsx`

Na `SectionEntrance` de `id="contact"`, entre o link LET'S_TALK e o copyright:

```tsx
<SectionEntrance id="contact" className="...">
  <div className="type-mono mb-8">Ready to start a project?</div>
  <a href={`mailto:${contactData.email}`} className="...">LET&apos;S_TALK</a>
  <SocialIcons />  {/* NOVO */}
  <div className="mt-20 type-mono opacity-50">© 2026 BRUNO GUIMARÃES...</div>
</SectionEntrance>
```

### 5. Estrutura esperada do componente

```
SocialIcons
├── ScrollReveal (stagger 0.1s) × 4
│   └── <a> link externo
│       ├── Índice (01, 02, 03, 04)
│       ├── <svg> ícone da marca (simple-icons path)
│       └── <ArrowUpRight /> (aparece no hover)
```

## Dependências

- **Nova:** `simple-icons` — ícones SVG oficiais das redes sociais
- **Existente:** `lucide-react` — `ArrowUpRight`
- **Existente:** `framer-motion` — `ScrollReveal`

## Testes

- Teste unitário (`SocialIcons.test.tsx`): renderiza 4 links, verifica atributos `href`, `target`, `rel`
- Verificar que o snapshot corresponde ao padrão visual esperado
- E2E: verificar que os ícones estão visíveis na homepage e os links funcionam

## Riscos

| Risco | Mitigação |
|-------|-----------|
| `simple-icons` é ~12.5KB gzipped | Tree-shaking reduz significativamente (só 4 ícones) |
| Ícones SVG inline podem afetar performance de renderização | Apenas 4 ícones pequenos, impacto desprezível |
| Links podem mudar no futuro | Centralizados em `site.ts`, fácil manutenção |
