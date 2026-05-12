---
title: 🔍 find
sidebar_position: 7
---

The `find` command **searches for files or folders** in your project.  

You can search in:

* `structure.sr` (the saved project structure)
* The **filesystem**
* Both at the same time

You can also search against a **git reference**.  
Files and folders listed in `.scaffoldignore` are automatically excluded from filesystem searches.

---

# Usage

```bash
sr find <name> [flags]
```

* `<name>` — The file, folder, or path to search for.

By default, both `structure.sr` and the filesystem are searched.

---

# Flags

| Flag                  | Description                       | Example                                  |
| --------------------- | --------------------------------- | ---------------------------------------- |
| `--fs`                | Search only in the **filesystem** | `sr find utils.ts --fs`                  |
| `--structure`, `--sr` | Search only in **structure.sr**   | `sr find utils.ts --structure`           |
| `--against <ref>`     | Search using a **git reference**  | `sr find utils.ts --against origin/main` |

---

# Examples

## Search in both structure and filesystem (default)

```bash
sr find utils.ts
```

* Searches for `utils.ts` in both `structure.sr` and the filesystem.
* Displays results with labels `[structure]` or `[fs]`.
* Ignored files/folders from `.scaffoldignore` are excluded from filesystem results.

---

## Search only in structure.sr

```bash
sr find utils.ts --structure
```

* Searches only within the `structure.sr` file.
* Displays matches with `[structure]` labels.

---

## Search only in the filesystem

```bash
sr find utils.ts --fs
```

* Searches only in the filesystem.
* Files/folders listed in `.scaffoldignore` are automatically excluded.
* Matches are labeled `[fs]`.

---

## Search against a git reference

```bash
sr find utils.ts --against origin/main
```

* Searches for `utils.ts` in a specific git commit or branch.
* Can be combined with `--fs` or `--structure` to restrict the search scope.

---

# Notes

* You **must provide a search query** (`<name>`).
* By default, both `structure.sr` and filesystem are searched. Use `--fs` or `--structure` to restrict scope.
* `[structure]` and `[fs]` labels indicate where each match was found.
* Files/folders ignored via `.scaffoldignore` are **excluded from filesystem search results**.
* `--against` is useful for finding files in past commits or branches.

---

# Related Commands

* `list` — Display structure or filesystem content
* `generate` — Sync `structure.sr` to filesystem
* `update` — Update `structure.sr` from filesystem
* `merge` — Merge filesystem into structure
* `validate` — Check consistency of structure and filesystem