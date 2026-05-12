---
title: 🚀 init
sidebar_position: 1
---
---

The `init` command initializes **Scaffoldrite in your project**.

It creates the `.scaffoldrite` directory and generates the core configuration files required to manage your project structure.

After initialization, you can begin using commands like `generate`, `validate`, `create`, and `list`.

---

# Usage

```bash
sr init [flags]
```

---

# What `init` Creates

Running `init` creates the following files:

```
.scaffoldrite/
  structure.sr
  .scaffoldignore
  project.json
```

### structure.sr

Defines your **project structure tree** used by Scaffoldrite.

### .scaffoldignore

Specifies files and folders that Scaffoldrite should ignore when scanning or generating structures.

### project.json

Stores **project metadata** such as framework, language, version, author, and conventions.

---

# Flags

| Flag              | Description                                                          | Example                   |
| ----------------- | -------------------------------------------------------------------- | ------------------------- |
| `--from-fs <dir>` | Generate `structure.sr` from an existing filesystem                  | `sr init --from-fs ./src` |
| `--empty`         | Create an empty structure with only the root folder                  | `sr init --empty`         |
| `--force`         | Overwrite existing Scaffoldrite configuration files                  | `sr init --force`         |
| `--migrate`       | Move legacy `structure.sr` or `.scaffoldignore` into `.scaffoldrite` | `sr init --migrate`       |

---

# Examples

## Initialize Scaffoldrite with default structure

```bash
sr init
```

Creates a default `structure.sr` template.

---

## Initialize from an existing project

```bash
sr init --from-fs ./src
```

Scaffoldrite scans the filesystem and generates a structure based on the folder layout.

---

## Create an empty structure

```bash
sr init --empty
```


This is useful if you want to manually define your structure.

---

## Overwrite existing configuration

```bash
sr init --force
```

Replaces existing:

* `structure.sr`
* `.scaffoldignore`
* `project.json`

---

## Migrate legacy configuration

```bash
sr init --migrate
```

Moves old configuration files into `.scaffoldrite`:

```
structure.sr        → .scaffoldrite/structure.sr
.scaffoldignore     → .scaffoldrite/.scaffoldignore
```

---

# Notes

* `init` only needs to be run **once per project**.
* Most Scaffoldrite commands require initialization before they can run.
* If Scaffoldrite is not initialized, commands like `generate` or `validate` will show an error.

---

# Related Commands

* `generate` — Generate project structure from `structure.sr`
* `update` — Update structure from filesystem
* `merge` — Merge filesystem into structure
* `validate` — Ensure filesystem matches the defined structure