---
title: 🔄 update
sidebar_position: 2
---
---

The `update` command updates the `structure.sr` file by scanning the **existing filesystem**.

It is used when files or folders have been **manually added, removed, or modified** and you want Scaffoldrite to **synchronize the structure definition with the actual project structure**.

Unlike `init`, which creates a structure definition for the first time, `update` **refreshes an existing `structure.sr` file based on the filesystem**.

---

# Usage

```bash
sr update --from-fs <directory> [flags]
```

The `--from-fs` flag is **required** and specifies the directory that should be scanned.

Use `.` to scan the **project root directory**.

---

# Options

| Flag | Description |
|-----|-------------|
| `--from-fs <directory>` | Directory to scan when updating the structure (**required**) |
| `--yes`, `--y` | Skip confirmation prompts |
| `--dry-run` | Show the changes that would be applied without modifying `structure.sr` |
| `--verbose` | Print detailed execution logs |

---

# Examples

## Update structure from the project root

```bash
sr update --from-fs .
```

Scans the project and updates `structure.sr` to match the current filesystem.

---

## Update structure from a specific directory

```bash
sr update --from-fs ./src
```

Only the `src` directory will be scanned and used to update the structure definition.

---

## Preview changes before updating

```bash
sr update --from-fs . --dry-run
```

Displays the changes that would be applied to `structure.sr` without modifying the file.

---

## Skip confirmation

```bash
sr update --from-fs . --yes
```

or

```bash
sr update --from-fs . --y
```

Useful for scripts or automated workflows.

---

# Example Scenario

Suppose you manually create a new folder:

```
src/
  components/
  hooks/
```

Running:

```bash
sr update --from-fs .
```

will update `structure.sr` so the new `hooks` directory is included.

---

# Notes

- `--from-fs` **must always be provided**.
- `update` **modifies `structure.sr`**, not the filesystem.
- Use `--dry-run` to safely preview changes before applying them.

---

# Related Commands

- `init` — Initialize Scaffoldrite in a project
- `merge` — Merge filesystem and structure definitions
- `generate` — Generate filesystem from `structure.sr`
- `validate` — Check if the filesystem matches the structure