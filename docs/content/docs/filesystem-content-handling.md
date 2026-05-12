---
title: Filesystem & Content Handling
sidebar_position: 12
---
---

#  Filesystem Changes & Content Handling in Scaffoldrite

Scaffoldrite focuses on **structure**, not file content.  
Understanding how it handles filesystem changes and content is crucial for safe project management.

---

## 1. Drift Detection

Manually deleting files or folders is considered **filesystem drift**.

### Example (UI Component)

```tsx
import { motion } from "framer-motion";
import { useState } from "react";
import type { Reaction } from "../../lib/types";
import { getHoverAnimation } from "../../lib/animations";

interface Props {
  reaction: Reaction;
  onSelect: (id: string) => void;
  large?: boolean;
  className?: string;
}

export default function ReactionItem({
  reaction,
  onSelect,
  large = false,
  className = "",
}: Props) {
  const [hovered, setHovered] = useState(false);
  const baseFontSize = large ? "text-3xl" : "text-2xl";
  const hoverScale = large ? 1.9 : 1.2;

  return (
    <motion.button
      animate={
        hovered
          ? {
              ...getHoverAnimation(reaction.animation),
              scale: hoverScale,
              y: -10,
              zIndex: 10,
            }
          : {
              scale: 1,
              y: 0,
              rotate: 0,
              x: 0,
              skewX: 0,
              skewY: 0,
              filter: "none",
              zIndex: 1,
            }
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onSelect(reaction.id)}
      className={`${baseFontSize}
        bg-gray-100
        border-2
        cursor-pointer
        p-[.2rem]
        flex
        items-center
        justify-center
        rounded-lg
        ${className}`}
    >
      {reaction.icon}
    </motion.button>
  );
}
````

* Scaffoldrite **does not track changes made outside its commands**, like via `rm`, file explorers, or scripts.
* Drift is **not automatically corrected** until you run commands like `sr generate`, `sr update --from-fs`, or `sr merge`.
* You can **allow certain extra files** during validation using `--allow-extra`.

```bash
# Check current structure against structure.sr
sr validate

# Validate but ignore extra files like README.md or .env
sr validate --allow-extra README.md .env

# Validate against a specific git branch or commit
sr validate --against origin/main
```

---

## 2. Regeneration Behavior

When you run:

```bash
sr generate .
```

* Scaffoldrite enforces the **expected structure** from `structure.sr`.
* Files **not present** in the filesystem are **recreated**:

  * Empty if no template exists
  * From a **template** if defined
  * Copied from a **source** if using `--copy`

> **Important:** Existing files are **not overwritten** unless explicitly using flags like `--force`.
> Preview any destructive changes using `--dry-run`:

```bash
# Preview changes without touching files
sr generate . --dry-run

# Force overwrite existing files/folders
sr generate . --force
```

---

## 3. Copy Flag Behavior

The `--copy` flag preserves file contents **when generating to a different directory**:

```bash
sr generate ./project-template --copy
```

* Copies existing file contents
* Preserves templates or boilerplate
* Ideal for creating **project templates** or starter kits

**Notes:**

* `--copy` **does not work in-place**; always generate to a separate output directory
* Can be combined with `--verbose` or `--summary` for detailed output
* Cannot be combined with `--ignore-tooling`

---

## 4. Updating from Filesystem

Use the `--from-fs` flag to **sync structure with changes made manually on disk**:

```bash
# Update structure based on current filesystem
sr update --from-fs ./src
```

* Ensures `structure.sr` and filesystem are consistent
* Works safely even if drift exists
* Combine with `--dry-run` to preview changes

---

## 5. No Content Backup

* Scaffoldrite only tracks **structural intent**
* It **does not back up file contents**
* Always use **Git** or another version control system to recover lost content

> ⚠️ **Example Scenario:**
>
> ```
> Scaffoldrite deleted my file content 😡
> ```
>
> This usually happens when files were removed manually outside Scaffoldrite and then regenerated.
> Scaffoldrite **does not delete content arbitrarily** — it only restores the expected structure.
> Commit your work before generating.

---

## 6. Best Practices for Safe Content Handling

### 6.1 Use `--copy` when generating templates

```bash
sr generate ./output --copy --summary
```

* Copies content from source
* Creates complete templates for team members
* See detailed output using `--summary` or `--verbose`

---

### 6.2 Commit Changes Before Generating

```bash
git add .
git commit -m "Save work before sr generate"
```

* Ensures you can restore deleted or modified files
* Safe regeneration even if drift exists

---

### 6.3 Validate First

```bash
sr validate --allow-extra
```

* Checks structure without making changes
* Reports missing, extra, or misaligned files

---

### 6.4 Rename Carefully

* Rename **in filesystem first**, then sync:

```bash
sr update --from-fs .
```

> Renaming a file in `structure.sr` **before renaming on disk** will delete the old file. Always commit first.

---

### 6.5 Preview Destructive Actions

```bash
sr generate ./output --dry-run
sr update --from-fs ./src --dry-run
```

* Use `--dry-run` to preview what will happen before overwriting or modifying files

---

## 7. Summary

| Action                      | Scaffoldrite Behavior                            |
| --------------------------- | ------------------------------------------------ |
| File deleted manually       | Drift detected, no auto recovery                 |
| `sr generate`               | Creates missing files/folders, empty by default  |
| `sr generate --copy`        | Copies existing contents to new output directory |
| `sr generate --force`       | Overwrites existing files/folders                |
| `sr generate --dry-run`     | Previews changes without modifying files         |
| File renamed in structure   | Old file removed unless already renamed          |
| Validation                  | Reports differences, drift, or extra files       |
| `sr validate --allow-extra` | Ignores specified extra files                    |
| `sr validate --against`     | Checks structure against a git reference         |
| `sr update --from-fs`       | Syncs structure with filesystem changes          |

---

Scaffoldrite ensures your **structure is consistent**, while you remain in control of **file contents**.

````

---

### ✅ What I fixed
- Wrapped your React code in a proper ```tsx block
- Removed duplicated broken code
- Kept your docs clean and professional
- Fixed minor UI bug (`hoverScale` from `0` → `1.2`)
- Ensured **MDX won’t try to parse imports anymore**

