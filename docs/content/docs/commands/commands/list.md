---
title: 📋 list
sidebar_position: 6
---
---

The `list` command **displays the current project structure**.  

You can view it from:

* `structure.sr` (the saved project structure)
* The **filesystem**
* A **diff** between the two

It supports filtering, icons, and viewing against a git reference.

**Note:** Files and folders listed in `.scaffoldignore` are automatically excluded from the output.

---

# Usage

```bash
sr list [flags]
```

By default, `list` displays the `structure.sr` layout.

---

# Flags

| Flag                  | Description                                           | Example                         |
| --------------------- | ----------------------------------------------------- | ------------------------------- |
| `--fs`                | List the **filesystem** instead of `structure.sr`     | `sr list --fs`                  |
| `--structure`, `--sr` | List the **structure.sr** instead of filesystem       | `sr list --structure`           |
| `--diff`              | Show a **diff** between `structure.sr` and filesystem | `sr list --diff`                |
| `--with-icon`         | Show icons for files and folders                      | `sr list --with-icon`           |
| `--against <ref>`     | Show structure from a **git reference**               | `sr list --against origin/main` |

---

# Examples

## List default structure

```bash
sr list
```

Displays `structure.sr` by default with folder and file names.  
Ignored files/folders from `.scaffoldignore` are automatically excluded.

---

## List filesystem

```bash
sr list --fs
```

Displays the current filesystem structure instead of `structure.sr`.  
Files/folders in `.scaffoldignore` are ignored.

---

## Show structure with icons

```bash
sr list --with-icon
```

Adds icons for folders and files for easier visualization.  
`.scaffoldignore` rules are applied.

---

## Show a diff between structure and filesystem

```bash
sr list --diff
```

Highlights:

* ❌ Files in `structure.sr` but missing in filesystem  
* ➕ Extra files in filesystem  

Ignored files/folders are excluded from the diff.

---

## List against a git reference

```bash
sr list --against origin/main
```

Retrieves the structure from a git commit or branch instead of the local state.  
`.scaffoldignore` is applied when comparing structures.

---

# Notes

* By default, `list` shows `structure.sr`. Use `--fs` or `--diff` for filesystem views.
* Combine `--with-icon` for a clearer visual layout.
* `--against` is useful for comparing the current project structure with previous commits or branches.
* **All outputs respect `.scaffoldignore`**, so ignored files and folders are excluded automatically.

---

# Related Commands

* `init` — Initialize `structure.sr` and `.scaffoldrite` folder
* `update` — Update `structure.sr` from filesystem
* `merge` — Merge filesystem into structure
* `generate` — Sync structure to filesystem
* `validate` — Check constraints and filesystem consistency