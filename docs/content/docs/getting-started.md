---
title: Getting Started
sidebar_position: 2
---
---


Scaffoldrite helps you **define, enforce, and generate your project structure** in minutes. This guide will get you up and running.

---

## 1. Install Scaffoldrite

Install globally using npm:

```bash
npm install -g scaffoldrite
````

You can then use either:

```bash
sr          # Short command (recommended)
scaffoldrite  # Full name
```

Both commands behave the same—use whichever fits your workflow.

---

## 2. Initialize Your Project

Create your project blueprint:

```bash
sr init
```

This generates the `.scaffoldrite/` folder with:

* `structure.sr` – your project’s architectural blueprint
* `.scaffoldignore` – files and folders to ignore
* `project.json` – project metadata


---

## 3. Define Your Structure

Edit `.scaffoldrite/structure.sr` to define your files and folders:

```txt
folder src {
  folder components {
    file Button.tsx
    file Header.tsx
  }
  folder utils {
    file helpers.ts
  }
  file index.ts
}

constraints {
  mustContain src index.ts
  maxFiles src/components 10
}
```

**Key Points:**

* **Literal names**: Scaffoldrite creates exactly what you declare.
* **Constraints**: Enforce rules like max files, required files, or naming patterns.
---

## 4. Generate Your Structure

Apply your blueprint to the filesystem:

```bash
sr generate .
```

Your project is now structured exactly as defined.

### Tips:

* Use `--dry-run` to preview changes without writing files.
* Use `--copy` to preserve file contents when generating to a **different directory**.

```bash
sr generate ./output --copy
```

---

## 5. Validate Your Structure

Ensure everything is in sync:

```bash
sr validate
```

* Detect missing, extra, or misaligned files
* Fail on violations in CI/CD pipelines
* Allow extras during migration with `--allow-extra`:

```bash
sr validate --allow-extra README.md .env
```

---

## 🎯 Recommended Workflow

```bash
# Initialize project
sr init

# Define structure
# Edit structure.sr

# Generate skeleton
sr generate .

# Validate in CI/CD
sr validate
```

> Scaffoldrite ensures your project structure is **predictable, enforceable, and maintainable** from day one.

---

Next: [The Structure Language](/structure-language)


