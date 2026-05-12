---
title: FAQ
sidebar_position: 15
---
---

Here are answers to common questions about Scaffoldrite usage, workflows, and best practices.

---

## 1. "What if I edit the filesystem manually?"

Manual edits can cause **drift**. Always run:

```bash
sr validate
````

* Use `sr update --from-fs .` to accept changes into `.scaffoldrite/structure.sr`
* Use `sr generate .` to revert to the defined structure

---

## 2. "Can I have multiple structure files?"

Not directly.
**Workarounds:**

```bash
sr generate ./project-a
sr generate ./project-b
```

* Each generation can target a separate directory
* You can maintain different structures per output folder

---

## 3. "Is Scaffoldrite like a linter for file structure?"

Exactly.

* Think **ESLint/Prettier**, but for your folder/file hierarchy
* It enforces rules and ensures consistent organization

---

## 4. "What about large dev files like `node_modules`?"

* Add them to `.scaffoldrite/.scaffoldignore`
* Or allow them temporarily with:

```bash
sr validate --allow-extra
```

---

## 5. "How do I preserve file content when generating templates?"

Use the `--copy` flag when generating to a **different output directory**:

```bash
sr generate ./template --copy
```

* Copies file contents from source to output
* Preserves boilerplate, starter code, or templates

> ⚠ `--copy` **does not work in-place**. Use Git or manual backup for regenerating in the same folder.

---

## 6. "Can I use `--copy` and `--ignore-tooling` together?"

No. They are **mutually exclusive**:

* `--copy` → preserves existing file contents
* `--ignore-tooling` → generates structure **without** Scaffoldrite config files

---

## 7. "Does `--copy` work when generating in the same directory?"

No. Always generate to a different output directory for `--copy` to work.

* In-place generation will create empty files or use templates only.

---

## 8. "Why do I need to provide a directory for `generate`?"

For **safety and clarity**:

* Use `.` → current directory
* Use `./output` → specific output folder

This prevents accidental overwrites of important files.

---

## 9. "How do I search for specific files or folders?"

Use the `find` command:

```bash
# Search both structure and filesystem
sr find Button

# Search only in structure.sr
sr find Button --sr

# Search only in filesystem
sr find Button --fs
```

---

## 10. "Can I have strict rules gradually?"

Yes, use **progressive constraint adoption**:

```bash
# Phase 1: Document only
sr validate --allow-extra

# Phase 2: Allow known exceptions
sr validate --allow-extra README.md .env

# Phase 3: Strict enforcement
sr validate
```

* Perfect for legacy projects or gradual adoption in teams

---

## 11. "What happens if I rename a file in `structure.sr`?"

> ⚠ Warning:

* Renaming **directly in `structure.sr`** will delete the old file in the filesystem
* Always **commit or back up** first
* Safer workflow:

```bash
# Rename in filesystem
mv src/oldfile.ts src/newfile.ts

# Sync structure
sr update --from-fs .
```

---

**Next up:** [Community & License](../community-license)

