---
title: 🔀 merge
sidebar_position: 3
---
---

The `merge` command merges the **current filesystem structure** into an existing `structure.sr`.

It is useful when **both the filesystem and the structure definition have changed**, and you want to **combine them without losing information**.

Unlike `update`, which replaces the structure with the filesystem layout, `merge` **preserves existing structure definitions and constraints while adding missing items from the filesystem**.

---

# Usage

```bash
sr merge --from-fs <directory> [flags]
```

The `--from-fs` flag is **required** and specifies the directory that will be scanned and merged into the structure.

Use `.` to scan the **project root directory**.

---

# Options

| Flag | Description |
|-----|-------------|
| `--from-fs <directory>` | Directory to scan when merging the filesystem (**required**) |
| `--yes`, `--y` | Skip confirmation prompts |
| `--dry-run` | Preview merge changes without modifying `structure.sr` |
| `--verbose` | Display detailed execution logs |

---

# Examples

## Merge filesystem changes from the project root

```bash
sr merge --from-fs .
```

Scans the project filesystem and adds any missing files or folders to `structure.sr`.

---

## Merge a specific directory

```bash
sr merge --from-fs ./src
```

Only the `src` directory will be scanned and merged into the structure definition.

---

## Preview merge changes

```bash
sr merge --from-fs . --dry-run
```

Displays the changes that would be applied without modifying `structure.sr`.

---

## Skip confirmation

```bash
sr merge --from-fs . --yes
```

or

```bash
sr merge --from-fs . --y
```

Useful in automated scripts or CI workflows.

---

# Example Scenario

Suppose your `structure.sr` contains:

```
src/
  components/
```

But your filesystem now contains:

```
src/
  components/
  utils/
```

Running:

```bash
sr merge --from-fs .
```

will update `structure.sr` to:

```
src/
  components/
  utils/
```

while preserving any **existing structure rules or constraints**.

---

# Notes

- `--from-fs` **must always be provided**.
- `merge` **preserves existing structure definitions and rules**.
- It only **adds missing filesystem items** to the structure.
- Use `--dry-run` to preview merge operations before applying them.

---

# Related Commands

- `init` — Initialize Scaffoldrite in a project
- `update` — Replace structure with the filesystem layout
- `generate` — Generate filesystem from `structure.sr`
- `validate` — Check if the filesystem matches the structure