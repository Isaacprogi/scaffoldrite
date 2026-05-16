---
title: 📦 deps
sidebar_position: 10
---

The `deps` command analyzes and visualizes **project dependencies** in a Scaffoldrite project.

It helps you understand how files relate to each other, detect architectural issues, and inspect dependency structure from either the **filesystem** or the **Scaffoldrite structure definition (`structure.sr`)**.

---

## Usage

```bash
sr deps [flags]
```

---

## Flags

| Flag           | Description                                        | Example                |
| -------------- | -------------------------------------------------- | ---------------------- |
| `--fs`         | Build dependency graph from the real filesystem    | `sr deps --fs`         |
| `--standalone` | Show files with no dependencies                    | `sr deps --standalone` |
| `--circular`   | Show circular dependency chains                    | `sr deps --circular`   |
| `--serve`      | Launch interactive dependency visualization server | `sr deps --serve`      |

---

## Behavior

### Source Selection

* `--fs` → analyzes actual filesystem imports
* default → analyzes `structure.sr` definition with respect to file system.

---

### Output Modes

You can control what is displayed:

* **Default** → full dependency tree
* `--standalone` → only isolated files
* `--circular` → only circular dependency issues
* `--serve` → launches a visual graph server (no CLI output)

---

## Examples

### Show full dependency tree

```bash id="deps_full_tree"
sr deps
```

Displays:

* complete dependency hierarchy
* standalone files
* circular dependency warnings

---

### Analyze filesystem directly

```bash id="deps_fs_mode"
sr deps --fs
```

Builds dependency graph from actual project files instead of `structure.sr`.

---

### Show circular dependencies only

```bash id="deps_circular_only"
sr deps --circular
```

Displays only circular dependency chains in the project.

---

### Show standalone files

```bash id="deps_standalone_only"
sr deps --standalone
```

Lists files that are not imported or referenced by any other file.

---

### Launch dependency server

```bash id="deps_serve_mode"
sr deps --serve
```

Starts an interactive visualization server for exploring dependency graphs.

---

## Output Types

### Dependency Tree

A hierarchical view of how modules depend on each other.

---

### Standalone Files

Files that are not referenced by any other module.

---

### Circular Dependencies

Dependency loops that can lead to:

* runtime issues
* tight coupling
* architecture instability

---

## Notes

* Large projects may produce complex graphs — use filters like `--standalone` or `--circular` for clarity.
* `--serve` is recommended for large codebases or visual debugging.
* Structure-based analysis ensures consistency with `structure.sr`.

---

## Related Commands

* `validate` — Check structure consistency
* `generate` — Build project structure
* `list` — Inspect file structure
* `lock` — Enforce project rules

