---
title: Advanced Scenarios
sidebar_position: 14
---
---

Scaffoldrite is designed for standard workflows, but real-world projects often require **advanced techniques**.  
This section covers patterns that help you handle complex structures, dynamic names, and progressive adoption of constraints.

---

## 1. Handling Dynamic-Looking Names

Many frameworks (Next.js, SvelteKit, etc.) use filenames that **look dynamic** but are valid literal names.  

```txt
folder src {
  folder pages {
    file [id].tsx        # Creates: src/pages/[id].tsx
    file [...slug].tsx   # Creates: src/pages/[...slug].tsx
    file (auth).tsx      # Creates: src/pages/(auth).tsx
  }
}

constraints {
  # Ensure every route group has a layout file
  eachFolderMustContainFile * src/pages layout.tsx
}
````

**Notes:**

* Scaffoldrite treats these names literally
* Supports framework conventions without renaming

---

## 2. Progressive Constraint Adoption

You may not want strict rules from day one. Scaffoldrite supports **phased adoption**.

```bash
# Phase 1: Document structure only
sr validate --allow-extra

# Phase 2: Allow known exceptions
sr validate --allow-extra README.md .env

# Phase 3: Strict enforcement
sr validate  # CI/CD fails on violations
```

**Use Case:**
Gradually enforce structure in legacy projects without breaking development.

---

## 3. Structure Migration

When restructuring a project:

```bash id="migr8k"
# Capture current state
sr init --from-fs . --force

# Edit .scaffoldrite/structure.sr
# Remove old folders, rename files

# Apply new structure
sr generate . --yes

# Validate no regressions
sr validate --allow-extra
```

**Tips:**

* Always commit changes before regenerating
* Use `--allow-extra` temporarily to avoid breaking validation
* Gradually remove legacy exceptions once structure stabilizes

---

## 4. Monorepo Consistency

For multi-package repos, enforce rules **across packages**:

```tsx
constraints {
  eachFolderMustContainFile * packages package.json
  eachFolderMustContain ** packages/src index.ts
}
```

**Benefits:**

* Ensures every package has an entry point
* Reduces accidental structural drift across packages

---

## 5. Framework-Specific Rules

Next.js API route enforcement:

```tsx
constraints {
  eachFolderMustContainFile ** src/pages _app.tsx
  fileNameRegex src/api/* ^(GET|POST|PUT|DELETE|PATCH)\.ts$
}
```

React component organization:

```txt
constraints {
  eachFolderMustContain * src/features index.ts
  maxDepth src/features 3
}
```

**Takeaway:**
Scaffoldrite adapts to your framework conventions without sacrificing control.

---

## 6. Using Both Structure and Filesystem

Sometimes you need a **hybrid workflow**:

```bash
# Generate structure based on structure.sr
sr generate .

# Pull changes from filesystem (manual edits)
sr update --from-fs .
```

* Combine **Scaffoldrite's rules** with manual changes
* Useful for collaborative projects or integrating external code

---

## 7. Best Practices for Advanced Scenarios

* **Always commit before major changes**
* **Use `--allow-extra`** during migration or refactoring
* **Progressively enforce constraints** to reduce friction
* **Test rules in CI/CD** before enforcing on production branches

---

**Next up:** [FAQ](../faq)

