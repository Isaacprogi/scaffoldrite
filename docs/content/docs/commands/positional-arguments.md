---
title: Positional Arguments
sidebar_position: 7
---
---

Scaffoldrite commands use **positional arguments** where the meaning of each argument depends on its **position in the command**.  
Flags (`--force`, `--yes`, etc.) are **extracted first** and do **not count as positional arguments**.

---

## 1. Argument Rules

1. **Flags are removed first** – All `--flag` or `-f` options are processed before positional arguments.  
2. **Remaining arguments are positional** – Their meaning depends on the command.  
3. **Flags with values** (e.g., `--from-fs ./src`) stay paired.  

---

## 2. Command Positional Arguments

| Command | Pos 1 | Pos 2 | Pos 3 | Pos 4 | Notes |
|---------|-------|-------|-------|-------|-------|
| `init` | Command | — | Directory (`--from-fs`) | — | Initializes structure |
| `update` | Command | — | Directory (`--from-fs`) | — | Updates structure from filesystem |
| `merge` | Command | — | Directory (`--from-fs`) | — | Merges folder structure |
| `list` | Command | — | — | — | Lists structure or filesystem |
| `create` | Command | Path | `file` or `folder` | — | Adds a file or folder |
| `delete` | Command | Path | — | — | Deletes a file or folder |
| `rename` | Command | Old path | New path/name | — | Renames file/folder |
| `generate` | Command | Output directory | — | — | Generates structure |
| `validate` | Command | — | — | — | Validates filesystem vs structure |
| `find` | Command | Search query | — | — | Finds file/folder |
| `version` | Command | — | — | — | Shows Scaffoldrite version |

> ⚠️ Commands like `generate` **require an output directory** (use `.` for current directory).

---

## 3. Examples

### Initialize from filesystem

```bash id="srinitfs"
sr init --from-fs ./src
# Pos 3: ./src
````

### Create a new file

```bash id="srcreatefile2"
sr create src/components/Button.ts file --yes
# Pos 2: Button.ts
# Pos 3: file
```

### Rename a folder

```bash id="srrenamefolder2"
sr rename src/old src/new --yes
# Pos 2: src/old
# Pos 3: src/new
```

### Generate structure in current directory

```bash id="srgeneratecurrent2"
sr generate .
# Pos 2: .
```

### Find a component in structure

```bash id="srfindsr"
sr find Button --sr
# Pos 2: Button
```

---

## 4. Best Practices

* **Provide required positional arguments** first, then add flags.
* Use `.` as the output directory to **avoid accidental overwrites**.
* Always check **positional meaning** in the command table to prevent mistakes.
* Combine with `--dry-run` to safely preview the effects of commands.

---

Next up: [Daily Workflows](/daily-workflows)

