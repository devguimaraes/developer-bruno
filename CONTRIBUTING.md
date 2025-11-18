# Contributing Guide

This project follows the **Gitflow** workflow.

## Branches

- **main**: Production-ready code.
- **develop**: Integration branch for features.
- **feature/**: New features (branch off `develop`).
- **release/**: Release preparation (branch off `develop`).
- **hotfix/**: Critical fixes (branch off `main`).

## Workflow

1. **New Feature**:

    ```bash
    git checkout develop
    git checkout -b feature/my-feature
    # ... work ...
    git commit -m "feat: description"
    # Merge back to develop via PR
    ```

2. **Release**:

    ```bash
    git checkout develop
    git checkout -b release/v1.0.0
    # ... prepare release ...
    # Merge to main and develop
    ```

3. **Hotfix**:

    ```bash
    git checkout main
    git checkout -b hotfix/critical-bug
    # ... fix ...
    # Merge to main and develop
    ```
