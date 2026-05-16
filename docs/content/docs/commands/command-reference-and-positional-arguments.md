---
title: Command Reference & Positional Arguments
sidebar_position: 5
---

This page documents **all Scaffoldrite commands**, their **positional arguments**, and **usage patterns**.

---

## 1. Argument Processing Rules

Before any command is executed:

1. **Flags are removed first**  
   All `--flag` or `-f` options are extracted and do NOT count as positional arguments.

2. **Remaining inputs are positional**  
   Their meaning depends entirely on the command and position.

---

## 2. Command Table (Positional Reference)

| Command | Pos 1 | Pos 2 | Pos 3 | Pos 4 | Notes |
|---------|-------|-------|-------|-------|-------|
| `init` | Command | — | Directory (`--from-fs`) | — | Initializes structure |
| `update` | Command | — | Directory (`--from-fs`) | — | Updates from filesystem |
| `merge` | Command | — | Directory (`--from-fs`) | — | Merges folder structure |
| `list` | Command | — | — | — | Lists structure or filesystem |
| `create` | Command | Path | `file` or `folder` | — | Creates file/folder |
| `delete` | Command | Path | — | — | Deletes file/folder |
| `rename` | Command | Old path | New path/name | — | Renames file/folder |
| `generate` | Command | Output directory | — | — | Generates structure |
| `validate` | Command | — | — | — | Validates filesystem vs structure |
| `find` | Command | Search query | — | — | Finds file/folder |
| `version` | Command | — | — | — | Shows version |
| `lock` | Command | — | — | — | Applies project restrictions |
| `unlock` | Command | — | — | — | Removes project restrictions |
| `deps` | Command | — | — | — | Analyzes project dependencies |

---

## 3. Usage Examples

### Initialize from filesystem
```bash
sr init --from-fs ./src
# Pos 3: ./src
```

---

### Create a file

```bash
sr create src/components/Button.ts file --yes
# Pos 2: src/components/Button.ts
# Pos 3: file
```

---

### Rename a file

```bash
sr rename src/oldfile.txt src/newfile.txt --yes
# Pos 2: oldfile.txt
# Pos 3: newfile.txt
```

---

### Generate structure

```bash
sr generate .
# Pos 2: .
```

---

### Find a component

```bash
sr find Button
# Pos 2: Button
```

---

### Lock project rules

```bash
sr lock --git
# Positional args: none (flag-driven command)
```

---

### Unlock project rules

```bash
sr unlock --structure
# Positional args: none (flag-driven command)
```

---

### Analyze dependencies

```bash
sr deps --fs
# Positional args: none (analysis mode via flags)
```

---

## 4. Best Practices

* Always provide required positional arguments first.
* Use `.` as a safe default output directory.
* Use `--dry-run` to preview changes before execution.
* Check the command table before assuming argument meaning.
* Flags can be combined in any order and are ignored in positional parsing.
* Commands like `lock`, `unlock`, and `deps` are **flag-driven only** (no positional inputs).