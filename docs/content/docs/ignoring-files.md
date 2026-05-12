---
title: Ignoring Files
sidebar_position: 10
---
---

Sometimes you want **exceptions** in your project structure.  
Scaffoldrite uses **`.scaffoldignore`** to ignore files or folders, just like `.gitignore`.

---

## 1. What `.scaffoldignore` Does

- Prevents files/folders from being considered when:
  - `sr init --from-fs` (snapshots ignore them)
  - `sr validate` (ignored files won’t trigger validation errors)
  - `sr list --fs` (filesystem listing ignores them)
  - `sr generate` (ignored files/folders are skipped)

---

## 2. Example `.scaffoldignore`

```txt
# Ignore dependencies
node_modules/

# Ignore build output
dist/

# Ignore temporary or cache folders
.temp/
.cache/

# Ignore logs
*.log

# Ignore environment files
.env
.env.local
````

---

## 3. Rules for `.scaffoldignore`

* Use **one entry per line**.
* Support **wildcards** (`*`) and recursive patterns (`**`):

  * `*.log` → All `.log` files in current folder
  * `logs/**` → All files under `logs/` folder recursively
* Lines starting with `#` are **comments**.
* Blank lines are **ignored**.
* Paths are **relative to `.scaffoldrite/`** folder.

---

## 4. Usage in Workflow

### During Init or Update

```bash
# Init structure from existing filesystem while ignoring certain folders
sr init --from-fs . 
```

`.scaffoldignore` ensures that **ignored files are not included** in the generated `structure.sr`.

### During Validation

```bash
# Validate structure while ignoring node_modules and dist
sr validate
```

Ignored files/folders will **not trigger errors**, even if they exist or are missing.

### During Generation

```bash
# Generate structure without affecting ignored files
sr generate . 
```

Ignored items are skipped to **prevent accidental deletion or overwriting**.

---

## 5. Tips

* Keep **temporary, auto-generated, or sensitive files** in `.scaffoldignore`.
* Always **commit `.scaffoldignore`** so the team shares the same ignored files.
* Use it alongside `--allow-extra` when validating to **relax checks for certain files**.

```bash
# Validate but allow extra ignored files
sr validate --allow-extra
```

> `.scaffoldignore` is your safeguard for files that should exist outside Scaffoldrite’s enforced structure.

---

**Next up:** [Project Configuration](../project-configuration)

