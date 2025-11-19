# 🌿 Git Workflow Documentation

## Overview

Este projeto utiliza um fluxo Git Flow manual para garantir organização e qualidade no desenvolvimento.

## Estrutura de Branches

### Branches Principais (Long-lived)

#### `main`

- **Propósito**: Produção, código estável e testado
- **Fonte**: Somente recebe merges de `hotfix/*` e `release/*`
- **Proteção**: Branch protegido, requer PR para alterações
- **Tags**: Cada versão recebe uma tag (`v1.0.0`, `v1.1.0`, etc.)

- **Propósito**: Integração de features, desenvolvimento contínuo
- **Fonte**: Recebe merges de `feature/*`
- **Base**: Branch base para novas features e releases
- **Deploy**: Ambiente de staging/homologação

### Branches de Suporte (Short-lived)

#### `feature/*`

- **Propósito**: Desenvolvimento de novas funcionalidades
- **Fonte**: Criado a partir de `develop`
- **Destino**: Merge de volta em `develop`
- **Nomenclatura**: `feature/nome-descritivo-da-feature`
- **Exemplos**:
  - `feature/user-authentication`
  - `feature/project-showcase`
  - `feature/contact-form`

#### `hotfix/*`

- **Propósito**: Correções urgentes em produção
- **Fonte**: Criado a partir de `main`
- **Destino**: Merge em `main` E `develop`
- **Nomenclatura**: `hotfix/descricao-correcao`
- **Exemplos**:
  - `hotfix/critical-security-patch`
  - `hotfix/fix-payment-bug`

#### `release/*`

- **Propósito**: Preparação de nova versão para produção
- **Fonte**: Criado a partir de `develop`
- **Destino**: Merge em `main` E `develop`
- **Nomenclatura**: `release/vX.Y.Z`
- **Exemplos**:
  - `release/v1.1.0`
  - `release/v2.0.0`

## Fluxo de Trabalho Detalhado

### 1. Iniciando Nova Feature

```bash
# 1. Garantir que develop está atualizado
git checkout develop
git pull origin develop

# 2. Criar branch da feature
git checkout -b feature/nome-da-feature

# 3. Desenvolvimento...
# - Commits frequentes e descritivos
# - Seguir conventional commits

# 4. Finalizar desenvolvimento
git add .
git commit -m "feat: implementar nova funcionalidade X"

# 5. Push para repositório remoto (opcional, para backup/colaboração)
git push -u origin feature/nome-da-feature

# 6. Abrir Pull Request para develop
# - Através do GitHub/GitLab interface
# - Aguardar code review e aprovação
```

### 2. Correção Urgente (Hotfix)

```bash
# 1. Criar hotfix a partir de main
git checkout main
git pull origin main
git checkout -b hotfix/correcao-critica

# 2. Implementar correção
git add .
git commit -m "fix: corrigir problema crítico X"

# 3. Aplicar em produção (main)
git checkout main
git merge hotfix/correcao-critica
git tag v1.0.1  # Incrementar versão
git push origin main --tags

# 4. Aplicar também em develop
git checkout develop
git merge hotfix/correcao-critica
git push origin develop

# 5. Remover branch do hotfix
git branch -d hotfix/correcao-critica
```

### 3. Preparando Release

```bash
# 1. Criar branch de release a partir de develop
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Finalizações da release
# - Atualizar changelog
# - Finalizar testes
# - Ajustes finais

git commit -m "chore: prepare v1.1.0 release"

# 3. Merge para main (produção)
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 4. Merge para develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# 5. Remover branch de release
git branch -d release/v1.1.0
```

## Padrão de Commits

Utilizamos [Conventional Commits](https://www.conventionalcommits.org/):

### Estrutura

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional]

[rodapé opcional]
```

### Tipos Principais

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação/estilo (sem mudança lógica)
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção, build, dependências
- `perf`: Performance
- `ci`: CI/CD
- `build`: Sistema de build

### Exemplos

```bash
feat(auth): adiciona integração com Google OAuth
fix(checkout): corrige timeout no processamento de pagamento
docs(readme): atualiza guia de instalação e configuração
style(components): corrige formatação do código
refactor(api): simplifica lógica de validação de usuário
test(contact): adiciona testes unitários para formulário de contato
chore(deps): atualiza React para v18.3.0
perf(images): otimiza carregamento da animação do hero
```

## Regras de Branch Protection (GitHub)

### Branch `main`

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging
- ✅ Include administrators
- ✅ Restrict pushes that create files

### Branch `develop`

- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging
- ✅ Include administrators

## Merge Guidelines

### Tipos de Merge Permitidos

- **`main`**: Somente **squash and merge**
- **`develop`**: **Squash and merge** ou **rebase and merge**
- **Feature branches**: Preferencialmente **squash and merge**

### Quando usar cada tipo

#### Squash and Merge

- Ideal para maioria dos casos
- Mantém histórico limpo
- Combina múltiplos commits em um

#### Rebase and Merge

- Quando se quer manter todos os commits individuais
- Útil para features complexas com múltiplos passos

#### Merge Commit

- Raramente utilizado
- Apenas para hotfixes urgentes

## Commands Úteis

```bash
# Ver status atual
git status
git branch -a
git log --oneline --graph --all

# Sincronizar branches
git fetch --all
git pull origin develop
git push origin develop

# Limpeza de branches locais
git branch -d nome-do-branch          # branch já merged
git branch -D nome-do-branch          # branch forçado
git remote prune origin               # remover branches remotos deletados

# Resolver conflitos
git checkout --theirs <file>          # usar versão do remote
git checkout --ours <file>            # usar versão local
git add <file>                        # marclar como resolvido
git commit                            # finalizar merge
```

## Boas Práticas

1. **Commits pequenos e frequentes**
2. **Mensagens de commit descritivas**
3. **Pull requests com boa descrição**
4. **Code review obrigatório**
5. **Testes antes de merge**
6. **Nunca commitar em main diretamente**
7. **Manter develop sempre estável**
8. **Deletar branches de feature após merge**
9. **Mensagens de descrição dos commits sempre em pt-br**

## Emergências

### Rollback de Produção

```bash
# Identificar versão estável anterior
git tag

# Rollback para versão anterior
git checkout main
git revert <commit-hash-do-problema>
git push origin main
```

### Hotflow Rápido

Para correções extremamente urgentes:

```bash
# Checkout, fix e push direto (apenas emergências)
git checkout main
git pull origin main
# fazer correção
git commit -m "hotfix: correção crítica urgente X"
git push origin main
# Criar branch posteriormente para aplicação em develop
```

---

## 📞 Suporte

Dúvidas sobre o workflow? Contate o mantenedor do projeto ou abra uma issue.
