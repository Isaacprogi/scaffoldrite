---
title: Structure Language
sidebar_position: 3
---
---

# The Structure Language (`structure.sr`)

Scaffoldrite uses **`structure.sr`**, a simple, literal language for describing exactly what your project structure should look like. No magic. No wildcards (unless explicitly supported for constraints). Just **clear, enforceable declarations**.

---

## 1. Basic Syntax

### Folders

```txt id="srfolder"
folder src {
  folder components {
    file Button.tsx
    file Header.tsx
  }
  folder utils {
    file helpers.ts
  }
}
````

* `folder <name> { ... }` creates a folder with nested files or folders.
* Nesting is literal; folders inside curly braces are children.

### Files

```txt id="srfile"
file index.ts
file README.md
```

* `file <name>` creates a file.
* Names are **literal**. Special characters (`[id]`, `...slug`) are preserved as-is.

### Example: Combined Structure

```txt id="srcombined"
folder src {
  folder pages {
    file index.tsx
    file about.tsx
  }
  folder api {
    folder users {
      file GET.ts
      file POST.ts
    }
  }
  file index.ts
}
```

> Creates exactly:

```
src/
├─ pages/
│  ├─ index.tsx
│  └─ about.tsx
├─ api/
│  └─ users/
│     ├─ GET.ts
│     └─ POST.ts
└─ index.ts
```

---

## 2. Literal Naming for Framework Conventions

Scaffoldrite respects framework-specific naming like **Next.js, SvelteKit, Remix**, etc.:

```txt id="srliteral"
folder src {
  folder pages {
    file [id].tsx        # literal filename
    file [...slug].tsx   # literal filename
    file (auth).tsx      # literal filename
  }
}
```

> These files are created **exactly** as named—perfect for dynamic routes.

---

## 3. Constraints in `structure.sr`

Constraints enforce **rules and expectations** on your structure:

```txt id="srconstraints"
constraints {
  require src                     # src/ must exist
  forbid temp/                     # temp/ must not exist
  mustContain src index.ts         # src/ must have index.ts
  maxFiles src/components 10       # no more than 10 files in components
  fileNameRegex src/components ^[A-Z][a-zA-Z]+\.tsx$ # enforce naming
}
```

**Key Constraint Types:**

* `require <path>` – folder must exist
* `forbid <path>` – folder must not exist
* `mustContain <path> <file>` – folder must contain file
* `maxFiles <path> <number>` – limit files
* `fileNameRegex <path> <regex>` – enforce naming patterns

---

## 4. Recursive & Each-Folder Constraints

Scaffoldrite can apply rules **recursively**:

```txt id="sreachfolder"
constraints {
  eachFolderMustContain * src/features index.ts      # direct children
  eachFolderMustContainFile ** src  README.md   # all nested folders
}
```

* `*` = all direct child folders
* `**` = all nested folders recursively

### Example: Next.js API Routes

```txt id="srnextapi"
constraints {
  eachFolderMustContainFile ** src/pages _app.tsx
  fileNameRegex src/api/* ^(GET|POST|PUT|DELETE|PATCH)\.ts$
}
```

> Ensures all pages have `_app.tsx` and API files follow naming conventions.

---

## 5. Summary

* **Folders:** `folder <name> { ... }`
* **Files:** `file <name>`
* **Constraints:** Enforce required folders, files, naming, limits
* **Literal Names:** Special characters preserved
* **Scopes:** `*` = direct children, `**` = recursive

`structure.sr` is your **single source of truth**—Scaffoldrite reads it to **generate, validate, and enforce** your project’s architecture.

---

Next up: [Commands](/commands)

