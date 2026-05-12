---
title: Command Reference
sidebar_position: 5
---
---


This page details **every Scaffoldrite command**, their **positional arguments**, and **common usage patterns**.

---

## 1. Command Table

| Command | Position 1 | Position 2 | Position 3 | Position 4 | Notes |
|---------|------------|------------|------------|------------|-------|
| `init` | (command) | — | Directory (`--from-fs`) | — | Initializes `structure.sr` |
| `update` | (command) | — | Directory (`--from-fs`) | — | Updates structure from filesystem |
| `merge` | (command) | — | Directory (`--from-fs`) | — | Merge existing folder structure |
| `list` | (command) | — | — | — | Shows structure or filesystem |
| `create` | (command) | Path to create | `file` or `folder` | — | Adds a file/folder |
| `delete` | (command) | Path to delete | — | — | Removes a file/folder |
| `rename` | (command) | Old path | New name/path | — | Renames file/folder |
| `generate` | (command) | Output directory (required) | — | — | Generate structure |
| `validate` | (command) | — | — | — | Checks filesystem vs structure |
| `find` | (command) | Search query | — | — | Finds file/folder in structure or filesystem |
| `version` | (command) | — | — | — | Shows Scaffoldrite version |

> ⚠️ All commands support **flags** (`--force`, `--yes`, etc.), which are **not counted as positional arguments**.

---

## 2. Argument Rules

1. **Flags are extracted first** – all `--flag` or `-f` options are removed before processing positional arguments.  
2. **Remaining arguments are positional** – meaning depends on the command.  
3. **Flag values are paired** – e.g., `--from-fs ./src` is treated as a single unit.  

---

## 3. Usage Examples

### Initialize from existing filesystem

```bash id="srinitfromfs"
sr init --from-fs ./src
# arg3: ./src
````

### Generate structure to current directory

```bash id="srgeneratecurrent"
sr generate .
# arg2: .
```

### Create a new file with flags

```bash id="srcreatefile"
sr create src/components/button.tsx  file --yes --verbose
# arg2: src/components/button
# arg3: file
```

### Rename a file with confirmation skip

```bash id="srrenamefile"
sr rename src/oldfile.txt newfile.txt --yes
# arg2: src/oldfile.txt
# arg3: newfile.txt
```

### Find a component

```bash id="srfindbutton"
sr find Button
# arg2: Button
```

### Generate with dry-run

```bash id="srgeneratedryrun"
sr generate ./dist --dry-run
# arg2: ./dist
```

### Generate and copy contents

```bash id="srgeneratecopy"
sr generate ./template --copy --summary
# arg2: ./template
```

---

## 4. Tips & Best Practices

* Always **provide output directories** for `generate` to avoid accidental overwrites.
* Use `--dry-run` to preview actions safely.
* Combine multiple flags freely; order **does not matter**.
* Remember: **flags stay paired with their values** (`--from-fs ./src` stays together).

---

Next up: [Flags Reference](/commands/flags-reference)
