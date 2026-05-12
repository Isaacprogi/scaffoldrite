---
title: 🔄 rename
sidebar_position: 8
---
---

The `rename` command changes the **name of a file or folder** in your Scaffoldrite project.

It updates both:

* the **filesystem**
* the **`structure.sr` definition**

This ensures your **project structure stays consistent** after renaming.

---

## Usage

```bash
sr rename <old-path> <new-name> [flags]
```

* `<old-path>` — The existing file or folder path  
* `<new-name>` — The new **name only**, not a full path

---

## Flags

| Flag          | Description                               | Example                                 |
| ------------- | ----------------------------------------- | --------------------------------------- |
| `--yes`, `-y` | Skip confirmation prompts                 | `sr rename src/temp temp-new --yes`     |
| `--dry-run`   | Preview the rename without changing files | `sr rename src/temp temp-new --dry-run` |
| `--verbose`   | Show detailed execution output            | `sr rename src/temp temp-new --verbose` |

---

## Examples

### Rename a file

```bash
sr rename src/utils/logger.ts logger-new.ts
```

Updates both:

```text
structure.sr
```

and the filesystem. Only the **filename** changes; the folder path stays the same.

---

### Rename a folder

```bash
sr rename src/temp temp-new
```

Renames the folder and all nested contents, updating both `structure.sr` and the filesystem. Only the folder **name changes**; its parent path remains `src/`.

---

### Skip confirmation

```bash
sr rename src/temp temp-new --yes
```

Renames the folder immediately without confirmation.

---

### Preview a rename

```bash
sr rename src/temp temp-new --dry-run
```

Displays what would be renamed without modifying the filesystem.

---

## Example Scenario

Suppose your structure contains:

```text
src/
  components/
  temp/
```

Running:

```bash
sr rename src/temp temp-new
```

Updates the filesystem to:

```text
src/
  components/
  temp-new/
```

and also updates `structure.sr` accordingly.

---

## Notes

* `rename` changes **both the filesystem and structure definition**.  
* Only the **name** changes; the parent folder path stays the same.  
* If the old path does not exist in the filesystem, Scaffoldrite still updates the structure.  
* Use `--dry-run` to safely preview changes.  
* Use `--yes` to skip prompts for automation or scripts.

---

## Related Commands

* `create` — Add files or folders  
* `delete` — Remove files or folders  
* `generate` — Generate filesystem from `structure.sr`  
* `validate` — Ensure filesystem matches the structure