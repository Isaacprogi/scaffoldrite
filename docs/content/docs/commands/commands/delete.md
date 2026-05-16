---
title: 🗑 delete
sidebar_position: 9
---

The `delete` command **removes a file or folder** from your Scaffoldrite project.  

It updates both:

* the **filesystem** (if the item exists)  
* the **`structure.sr` definition**

Files or folders listed in `.scaffoldignore` are **excluded from deletion**.

This ensures your **project structure stays synchronized with the actual filesystem**.

---

## Usage

```bash
sr delete <path> [flags]
```

* `<path>` — Path of the file or folder to delete

---

## Flags

| Flag          | Description                             | Example                        |
| ------------- | --------------------------------------- | ------------------------------ |
| `--yes`, `-y` | Skip confirmation prompts               | `sr delete src/temp --yes`     |
| `--dry-run`   | Preview deletion without removing files | `sr delete src/temp --dry-run` |
| `--verbose`   | Show detailed execution output          | `sr delete src/temp --verbose` |
| `--summary`   | Show summarized execution               | `sr delete src/utils --summary`|

---

## Examples

### Delete a file

```bash
sr delete src/utils/logger.ts
```

Removes:

```
src/utils/logger.ts
```

From both the filesystem (if present) and `structure.sr`.

---

### Delete a folder

```bash
sr delete src/temp
```

Removes the folder and all nested contents, updating both `structure.sr` and the filesystem.

---

### Skip confirmation prompts

```bash
sr delete src/temp --yes
```

Deletes the folder immediately without asking for confirmation. Useful in scripts or CI.

---

### Preview deletion

```bash
sr delete src/temp --dry-run
```

Shows what would be deleted without modifying the filesystem or `structure.sr`.

---

### Verbose output

```bash
sr delete src/temp --verbose
```

Displays step-by-step operations, including which items were deleted, skipped, or otherwise processed.

---

## Example Scenario

Suppose your project structure contains:

```
src/
  components/
  temp/
```

Running:

```bash
sr delete src/temp
```

Will update the filesystem to:

```
src/
  components/
```

And remove `temp` from `structure.sr` accordingly.

---

## Notes

* `delete` removes items from **both the filesystem and structure definition**.  
* Files or folders ignored via `.scaffoldignore` are **not deleted**.  
* Be careful when deleting folders, as **all nested files and folders will also be removed**.  
* Use `--dry-run` to safely preview deletions.  
* Use `--yes` for automation or scripts.  
* Use `--verbose` to see detailed progress, or `--summary` for a concise overview.

---

## Related Commands

* `create` — Add new files or folders  
* `rename` — Rename items in the structure  
* `generate` — Generate filesystem from `structure.sr`  
* `update` — Update `structure.sr` from filesystem  
* `validate` — Ensure filesystem matches the structure
