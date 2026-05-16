---
title: 🔒 lock
sidebar_position: 8
---

The `lock` command enforces restrictions on your Scaffoldrite project to protect structure integrity, CI behavior, Git workflows, or configuration rules.

It is mainly used in **team environments and production setups** to prevent unsafe or unintended changes.

---

## Usage

```bash
sr lock [flags]
```

---

## Lock Types (Flags)

| Flag          | Description                                               | Example               |
| ------------- | --------------------------------------------------------- | --------------------- |
| `--git`       | Locks Git workflow using hooks (e.g. pre-push protection) | `sr lock --git`       |
| `--structure` | Prevents manual changes that violate `structure.sr`       | `sr lock --structure` |
| `--ci`        | Enables CI-level structure validation rules               | `sr lock --ci`        |

---

## Behavior

* Only **one lock type is executed per command run**

* Flags are evaluated in order:

  1. `--git`
  2. `--structure`
  3. `--ci`

* If no flag is provided, available options are displayed.

---

## Examples

### Lock Git workflow

```bash
sr lock --git
```

Installs Git hooks to enforce structure rules before commits or pushes.

---

### Lock project structure

```bash
sr lock --structure
```

Prevents manual filesystem changes that violate `structure.sr`.

---

### Enforce CI validation rules

```bash
sr lock --ci --against main
```

Ensures CI pipelines validate structure consistency during builds.

---


Applies configuration-based restrictions for production or selected environments.

---

## Notes
* Locks are **non-destructive** — they enforce rules rather than modifying or deleting files.
* Git locks are commonly used in collaborative development environments.
* CI locks are best suited for automated pipelines.

---

## Related Commands

* `unlock` — Remove applied locks
* `validate` — Check project integrity
* `generate` — Rebuild structure from definition

