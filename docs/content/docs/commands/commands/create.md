---
title: ➕ create
sidebar_position: 5
---

The `create` command adds a **new file or folder** to your Scaffoldrite project structure.

It updates both:

* the **filesystem**
* the **`structure.sr` definition**

This ensures that your **actual project files stay synchronized with your defined structure**.

---

## Usage

```bash
sr create <path> <type> [flags]
```

* `<path>` — Full path of the file or folder to create
* `<type>` — Either `file` or `folder`

---

## Flags

| Flag              | Description                                      | Example                                         |
| ----------------- | ------------------------------------------------ | ----------------------------------------------- |
| `--force`         | Overwrite if the file or folder already exists   | `sr create src/Button.ts file --force`          |
| `--yes`, `-y`     | Skip confirmation prompts                        | `sr create src/components/Button.ts file --yes` |
| `--dry-run`       | Preview creation without modifying files         | `sr create src/Button.ts file --dry-run`        |
| `--verbose`       | Show detailed execution output                   | `sr create src/utils folder --verbose`          |
| `--summary`       | Show summarized execution output                 | `sr create src/utils folder --summary`          |
| `--if-not-exists` | Only create if the target does not already exist | `sr create src/Button.ts file --if-not-exists`  |

---

## Examples

### Create a new file

```bash
sr create src/components/Button.ts file
```

Creates:

```txt
src/components/Button.ts
```

and updates `structure.sr`.

---

### Create a new folder

```bash
sr create src/hooks folder
```

Creates:

```txt
src/hooks/
```

and updates `structure.sr`.

---

### Force overwrite existing file

```bash
sr create src/components/Button.ts file --force
```

Replaces the existing file if it already exists.

---

### Preview creation

```bash
sr create src/components/Card.ts file --dry-run
```

Shows what would be created without modifying the filesystem.

---

### Create only if missing

```bash
sr create src/components/Button.ts file --if-not-exists
```

Creates the file only if it does not already exist.

---

## Example Scenario

If your structure currently contains:

```txt
src/
  components/
```

Running:

```bash
sr create src/components/Modal.ts file
```

Updates the filesystem to:

```txt
src/
  components/
    Modal.ts
```

and also updates `structure.sr`.

---

## Notes

* `create` keeps **filesystem and structure definition in sync**.
* Always specify `file` or `folder` as the type.
* Use `--dry-run` to preview changes safely.
* Use `--force` carefully to avoid overwriting files.
* Use `--if-not-exists` to avoid accidental replacements.

---

## Related Commands

* `delete` — Remove files or folders
* `rename` — Rename files or folders
* `generate` — Generate filesystem from structure
* `validate` — Ensure filesystem matches structure

