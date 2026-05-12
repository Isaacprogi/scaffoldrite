---
title: Daily Workflows
sidebar_position: 8
---
---

Scaffoldrite streamlines your day-to-day project management. This guide shows **common workflows** from initialization to validation, generation, and modification.

---

## 1. Initialize & Setup

| Command | What It Does | When To Use |
|---------|-------------|-------------|
| `sr init` | Creates a starter `structure.sr` | Starting a new project |
| `sr init --empty` | Creates minimal structure with only constraints | When you want full control |
| `sr init --from-fs <directory>` | Generates `structure.sr` from an existing project | Adopting Scaffoldrite in an existing codebase |
| `sr update --from-fs <directory>` | Updates `structure.sr` from filesystem | Sync structure after manual changes |
| `sr merge --from-fs <directory>` | Merges folder structure into current `structure.sr` | Combine multiple layouts |
| `sr init --force` | Overwrites existing config | Starting fresh |

```bash id="initworkflow"
# Generate to current directory
sr generate .

# Generate to a specific directory
sr generate ./output

# Init from current directory
sr init --from-fs .

# Update from specific directory
sr update --from-fs ./components
````

> ⚠️ Always provide a directory for commands that require it (`generate`, `update`, `merge`, `init --from-fs`).

---

## 2. Validate & Check

| Command                                | What It Does                                | When To Use                                         |
| -------------------------------------- | ------------------------------------------- | --------------------------------------------------- |
| `sr validate`                          | Checks if filesystem matches `structure.sr` | Before commits or CI/CD                             |
| `sr validate --allow-extra`            | Allows extra files not in structure         | During migration or partial adoption                |
| `sr validate --allow-extra <paths...>` | Allows specific extra files                 | When some files are intentionally outside structure |

```bash id="validateworkflow"
# Strict check
sr validate

# Migration phase
sr validate --allow-extra

# Only allow certain extras
sr validate --allow-extra README.md .env.example
```

---

## 3. Generate & Create

| Command                       | What It Does                           | When To Use                         |
| ----------------------------- | -------------------------------------- | ----------------------------------- |
| `sr generate <directory>`     | Creates entire structure               | Initial setup or reset              |
| `sr generate ./output`        | Generates to specific directory        | Creating templates for others       |
| `sr generate . --yes`         | Skips confirmation prompts             | Automation scripts                  |
| `sr generate . --dry-run`     | Previews what would happen             | Review before applying              |
| `sr generate ./output --copy` | Copies structure **and** file contents | Creating complete project templates |

```bash id="generateworkflow"
# Create structure in current directory
sr generate .

# Copy structure AND contents to output
sr generate ./project-template --copy

# Preview before copying
sr generate ./dist --copy --dry-run
```

---

## 4. Modify & Evolve

| Command                             | What It Does                            | When To Use                |
| ----------------------------------- | --------------------------------------- | -------------------------- |
| `sr create <path> folder`           | Adds folder                             | Adding new feature areas   |
| `sr create <path> file`             | Adds file                               | Creating new modules       |
| `sr delete <path>`                  | Removes from structure                  | Cleaning up tech debt      |
| `sr rename <old> <new>`             | Renames in structure                    | Refactoring                |
| `sr update --from-fs .`             | Syncs `structure.sr` from current files | After manual tweaks        |
| `sr merge --from-fs ./new-features` | Merges new files into `structure.sr`    | Collaborative feature adds |

```bash id="modifyworkflow"
# Add a utils folder
sr create src/utils folder

# Rename to helpers
sr rename src/utils src/helpers

# Add a utility file
sr create src/helpers/format.ts file

# Remove it
sr delete src/helpers/format.ts
```

---

## 5. Inspect & Understand

| Command               | What It Does                                      | When To Use            |
| --------------------- | ------------------------------------------------- | ---------------------- |
| `sr list`             | Shows all `structure.sr` contents                 | Quick reference        |
| `sr list --structure` | Shows `structure.sr` respecting ignore list       | Quick reference        |
| `sr list --fs`        | Shows actual filesystem                           | Check current state    |
| `sr list --diff`      | Compares `structure.sr` vs filesystem             | Find discrepancies     |
| `sr find <query>`     | Searches files/folders in structure or filesystem | Locate specific items  |
| `sr version`          | Shows Scaffoldrite version                        | Debugging or reporting |

```bash id="inspectworkflow"
# Check expected vs actual
sr list

# View actual filesystem
sr list --fs

# Compare structure vs filesystem
sr list --diff

# Find a component
sr find Button

# Search only in structure.sr
sr find Button --sr

# Search only in filesystem
sr find Button --fs
```

---

**Next up:** [Constraints](../constraints)

