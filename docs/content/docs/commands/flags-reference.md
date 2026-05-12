---
title: Flags Reference
sidebar_position: 6
---
---


Scaffoldrite commands can be modified with **flags** to change their behavior. Flags can usually be combined and provide fine-grained control over operations.

> ⚠️ Flags are **not counted as positional arguments**. They are parsed and processed before positional arguments.

---

## 1. Common Flags

| Flag | Description | Example |
|------|-------------|---------|
| `--force` | Overwrite existing files, folders, or config | `sr init --force` |
| `--yes`, `-y` | Skip confirmation prompts | `sr delete src/temp --yes` |
| `--dry-run` | Preview changes without applying them | `sr generate . --dry-run` |
| `--verbose` | Show detailed operation logs | `sr create src/utils.ts file --verbose` |
| `--summary` | Show a concise summary of operations | `sr generate ./output --summary` |
| `--copy` | Copy file contents when generating | `sr generate ./template --copy` |
| `--ignore-tooling` | Generate structure without Scaffoldrite metadata or config files | `sr generate ./starter-kit --ignore-tooling` |
| `--from-fs <directory>` | Use filesystem as source for init, update, or merge | `sr init --from-fs ./src` |
| `--structure`, `--sr` | Operate only on `structure.sr` | `sr find Button --sr` |
| `--fs` | Operate only on filesystem | `sr find Button --fs` |
| `--allow-extra` | Allow extra files not defined in structure | `sr validate --allow-extra` |
| `--allow-extra <paths...>` | Allow specific extra files | `sr validate --allow-extra README.md .env` |
| `--circular` | Show circular dependencies in structure | `sr list --circular` |
| `--standalone` | Show standalone files in structure | `sr list --standalone` |
| `--json` | Output results in JSON format | `sr list --json` |
| `--serve` | Serve structure or dependency graph in a web view | `sr list --serve` |
| `--only <ref>` | Operate only against a specific git ref | `sr validate --only origin/main` |
| `--against <ref>` | Compare or generate against a specific git ref | `sr generate . --against origin/main` |
| `--local-ast` | Use local AST instead of git ref | `sr generate . --against origin/main --local-ast` |
| `--empty` | Initialize an empty structure.sr | `sr init --empty` |
| `--migrate` | Migrate legacy config to current Scaffoldrite directory | `sr init --migrate` |

---

## 2. Examples

### Force overwrite existing configuration
```bash
sr init --force
````

### Skip confirmations when deleting

```bash
sr delete src/old --yes
```

### Preview what would happen without making changes

```bash
sr generate ./dist --dry-run
```

### Generate structure AND copy existing file contents

```bash
sr generate ./template --copy --summary
```

### Initialize from filesystem

```bash
sr init --from-fs ./src
```

### Validate but allow extra files

```bash
sr validate --allow-extra README.md .env
```

### Search only in structure.sr or filesystem

```bash
sr find Button --sr
sr find Button --fs
```

### Compare structure against a git branch

```bash
sr validate --against origin/main
sr generate . --against origin/main
```

### Serve structure or dependency graph in a web view

```bash
sr list --serve
```

---

## 3. Best Practices

* Place **flags after positional arguments** for clarity:

```bash
sr create src/components/Button.ts file --verbose --force
```

* Flags **can be combined freely**; order does not matter.
* Flags that require **values** (like `--from-fs ./src`) should keep the value immediately after the flag.
* Use `--dry-run` to preview any destructive action before executing it.
* Combine `--verbose` or `--summary` to control the level of output during operations.

---

Next up: [Positional Arguments Reference](/docs/commands/positional-arguments)

```

---

If you want, I can also **add a visual cheat sheet section** with grouped flags (`Safety`, `Output`, `Source`, `Advanced`) so users can quickly scan them—this is great for long CLI docs.  

Do you want me to do that?
```
