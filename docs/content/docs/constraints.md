---
title: Constraints
sidebar_position: 9
---
---

Constraints are **rules that enforce your project's structure**.  
They help prevent mistakes, ensure consistency, and maintain codebase hygiene.

---

## 1. Basic Constraints

| Constraint | Meaning | Example |
|------------|---------|---------|
| `require <path>` | The folder or file **must exist** | `require src` |
| `forbid <path>` | The folder or file **must NOT exist** | `forbid temp/` |
| `mustContain <path> <value>` | The folder must contain a specific file/folder | `mustContain src index.ts` |
| `mustHaveFile <path> <fileName>` | The exact file must exist | `mustHaveFile src/components Button.tsx` |
| `maxFiles <path> <number>` | No more than N files in folder | `maxFiles src/components 10` |
| `maxDepth <path> <number>` | Maximum nested folder depth | `maxDepth src 4` |
| `fileNameRegex <path> <regex>` | Files must match a naming pattern | `fileNameRegex src/components ^[A-Z][a-zA-Z]+\.tsx$` |

```txt
constraints {
  require src
  forbid .temp
  mustContain src index.ts
  mustHaveFile src/components Button.tsx
  maxFiles src/components 15
  fileNameRegex src/components/ ^[A-Z][a-zA-Z]+\.tsx$
}
````

---

## 2. "Each Folder" Constraints

Apply rules to **all child folders** using `*` (direct children) or `**` (recursive).

| Constraint                                          | Meaning                                                    | Example                                      |
| --------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| `eachFolderMustContain * <path> <value>`            | Every direct child folder must contain file/folder         | `eachFolderMustContain * src index.ts`       |
| `eachFolderMustContainFile ** <path> <fileName>`    | Every folder (recursive) must contain this file            | `eachFolderMustContainFile ** src README.md` |
| `eachFolderMustContainFolder * <path> <folderName>` | Every folder must have a subfolder                         | `eachFolderMustContainFolder * src tests`    |
| `eachFolderMustHaveExt ** <path> <ext>`             | Every folder must have at least one file of this extension | `eachFolderMustHaveExt ** src .ts`           |

**Examples:**

1. **Monorepo Package Consistency**

```txt
constraints {
  eachFolderMustContainFile * packages package.json
  eachFolderMustContain ** packages/src index.ts
}
```

2. **Next.js API Route Standards**

```txt
constraints {
  eachFolderMustContainFile ** src/pages _app.tsx
  fileNameRegex src/api/* ^(GET|POST|PUT|DELETE|PATCH)\.ts$
}
```

3. **React Component Organization**

```txt
constraints {
  eachFolderMustContain * src/features index.ts
  maxDepth src/features 3
}
```

---

## 3. Complete Constraint Reference

| Constraint                    | Arguments                     | Description                                  |
| ----------------------------- | ----------------------------- | -------------------------------------------- |
| `require`                     | `<path>`                      | Folder/file must exist                       |
| `forbid`                      | `<path>`                      | Folder/file must not exist                   |
| `mustContain`                 | `<path> <value>`              | Folder must contain file/folder              |
| `mustHaveFile`                | `<path> <fileName>`           | Exact file must exist                        |
| `fileNameRegex`               | `<path> <regex>`              | Enforce file naming pattern                  |
| `maxFiles`                    | `<path> <number>`             | Max files in folder                          |
| `maxFolders`                  | `<path> <number>`             | Max subfolders in folder                     |
| `minFiles`                    | `<path> <number>`             | Minimum files in folder                      |
| `minFolders`                  | `<path> <number>`             | Minimum subfolders in folder                 |
| `maxDepth`                    | `<path> <number>`             | Maximum folder nesting depth                 |
| `maxFilesRecursive`           | `<path> <number>`             | Max files recursively                        |
| `maxFoldersRecursive`         | `<path> <number>`             | Max folders recursively                      |
| `maxFilesByExt`               | `<path> <ext> <number>`       | Max files of specific extension              |
| `maxFilesByExtRecursive`      | `<path> <ext> <number>`       | Max files of extension recursively           |
| `eachFolderMustContain`       | `<scope> <path> <value>`      | Each folder must contain file/folder         |
| `eachFolderMustContainFile`   | `<scope> <path> <fileName>`   | Each folder must have this file              |
| `eachFolderMustContainFolder` | `<scope> <path> <folderName>` | Each folder must have this subfolder         |
| `eachFolderMustHaveExt`       | `<scope> <path> <ext>`        | Each folder must contain file with extension |

---

## 4. Notes & Tips

* **Use `*` for direct children** and `**` for all nested folders.
* Combine constraints for **strict enforcement** of architecture standards.
* Apply constraints gradually in phases:

  1. Start with **require / mustContain** for essential structure
  2. Add **fileNameRegex / maxFiles / maxDepth** as the project grows
  3. Use **eachFolder** constraints for large monorepos or multi-module projects

---

**Next up:** [Ignoring Files](../ignoring-files)

