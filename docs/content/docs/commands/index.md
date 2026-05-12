---
title: Commands
sidebar_position: 4
---
---


Scaffoldrite gives you **full control** over your project structure with a consistent set of commands. These commands let you **initialize, generate, validate, modify, and inspect** your project layout.

---

## 1. Command Categories

Scaffoldrite commands are organized by purpose:

| Category | Commands | Purpose |
|----------|----------|---------|
| **Initialize & Setup** | `init`, `update`, `merge` | Create or sync your `structure.sr` with your filesystem |
| **Generate & Create** | `generate`, `create` | Generate entire structure or add files/folders |
| **Modify & Evolve** | `rename`, `delete` | Rename or remove items from the structure |
| **Inspect & Understand** | `list`, `find`, `version` | View your structure, search for items, check Scaffoldrite version |
| **Validation** | `validate` | Ensure the filesystem matches your `structure.sr` constraints |

---

## 2. Command Syntax

Scaffoldrite uses **positional arguments** with optional **flags**:

```bash id="srsyntax"
sr <command> [arg1] [arg2] ... [flags]
````

* **Positional arguments** are interpreted based on command.
* **Flags** (`--flag`, `-f`) are extracted first and don’t count as positional arguments.
* Use `--help` for command-specific guidance:

```bash id="srhelp"
sr init --help
```

---

## 3. Examples

### Initialize a new project

```bash id="srinit"
sr init
```

### Generate structure in the current directory

```bash id="srgenerate"
sr generate .
```

### Create a new folder

```bash id="srcreatefolder"
sr create src/components folder
```

### Rename a file

```bash id="srrename"
sr rename src/index.ts main.ts
```

### Delete a folder

```bash id="srdelete"
sr delete src/temp
```

### List your structure

```bash id="srlist"
sr list --structure
sr list --fs
sr list --diff
```

### Find a specific file or folder

```bash id="srfind"
sr find Button
sr find Button --sr   # search only structure.sr
sr find Button --fs   # search only filesystem
```

---

## 4. Best Practices

* Place **flags after positional arguments** for clarity.
* Flag order **does not matter**.
* Always provide the **output directory** when using `generate` to prevent accidental overwrites.
* Use `--dry-run` to **preview actions** without modifying files.

---

Next up: [Command Reference](/commands/command-reference)

