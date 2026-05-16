---

title: ⚡ generate
sidebar_position: 4
-------------------

The `generate` command creates a **filesystem structure from your `structure.sr` definition**.

It reads the project structure defined in `.scaffoldrite/structure.sr` and generates the corresponding **folders and files** in the target directory.

This command is typically used to **scaffold new projects, create templates, or restore a project structure**.

---

## Usage

```bash
sr generate <output-directory> [flags]
```

`<output-directory>` is **required**. Use `.` to generate in the current directory.

---

## Git Reference (`--against`)

You can generate a project structure using the `structure.sr` from a specific git reference using `--against <ref>`.

**Valid git references include:**

* Branch names (local or remote)

  ```bash
  sr generate . --against main
  sr generate . --against origin/develop
  ```
* Tags

  ```bash
  sr generate . --against v1.2.3
  ```
* Commit hashes (full or short)

  ```bash
  sr generate . --against a1b2c3d
  sr generate . --against a1b2c3d4e5f6g7h8i9j0
  ```
* Relative commit references

  ```bash
  sr generate . --against HEAD~1
  sr generate . --against HEAD~3
  ```
* Any valid git ref that `git show` can resolve

**Notes:**

* Scaffoldrite will read `.scaffoldrite/structure.sr` from the given git reference.
* Errors occur if the ref does not exist or the structure file is missing in that commit.
* Use `git fetch origin` to ensure remote branches and tags are up to date.

---

## Positional Arguments

| Position | Argument         | Description                             |
| -------- | ---------------- | --------------------------------------- |
| 1        | `generate`       | The command                             |
| 2        | Output directory | Where the structure should be generated |

Example:

```bash
sr generate .
```

---

## Flags

| Flag               | Description                               | Example                          |
| ------------------ | ----------------------------------------- | -------------------------------- |
| `--copy`           | Copy file contents when generating        | `sr generate . --copy`           |
| `--force`          | Overwrite existing files and folders      | `sr generate . --force`          |
| `--yes`, `-y`      | Skip confirmation prompts                 | `sr generate . --yes`            |
| `--dry-run`        | Preview actions without creating files    | `sr generate . --dry-run`        |
| `--summary`        | Show operations as they happen            | `sr generate . --summary`        |
| `--ignore-tooling` | Do not generate Scaffoldrite config files | `sr generate . --ignore-tooling` |
| `--verbose`        | Show detailed execution output            | `sr generate . --verbose`        |

---

## Examples

### Generate structure in the current directory

```bash
sr generate .
```

Creates folders and files based on `structure.sr`.

---

### Generate using a git reference

```bash
sr generate . --against origin/main
```

Uses the `structure.sr` from the specified branch, tag, or commit.

---

### Generate into another directory

```bash
sr generate ./starter-project
```

Creates the project structure inside `starter-project`.

---

### Generate and copy file contents

```bash
sr generate ./template --copy
```

If files already exist in the structure source, their **contents will also be copied**.

---

### Force overwrite existing files

```bash
sr generate . --force
```

Replaces files that already exist in the target directory.

---

### Preview generation

```bash
sr generate . --dry-run
```

Shows what would be created without modifying the filesystem.

---

### Generate without Scaffoldrite tooling files

```bash
sr generate ./template --ignore-tooling
```

The following will **not be generated**:

```
.scaffoldrite/
structure.sr
.scaffoldignore
project.json
```

---

## Notes

* `generate` **creates filesystem structure from the structure definition**.
* Always provide an **output directory** to avoid unintended overwrites.
* Use `--dry-run` when testing large scaffolds.
* Use `--force` carefully because it can overwrite files.
* Use `--against` to generate from a past commit, branch, or tag.

---

## Related Commands

* `init` — Initialize Scaffoldrite
* `update` — Update structure from filesystem
* `merge` — Merge filesystem into structure
* `validate` — Ensure filesystem matches the structure

