---
title: Project Configuration
sidebar_position: 11
---
---

Scaffoldrite uses a **project configuration file** to store metadata about your project.  
This helps your team understand **frameworks, language choices, conventions, and architectural decisions**.

---

## 1. The `project.json` File

When you run:

```bash
sr init
````

Scaffoldrite creates:

```
.scaffoldrite/project.json
```

This file contains:

```json
{
  "framework": "",
  "language": "",
  "version": "1.0.0",
  "author": "",
  "conventions": {
    "description": "",
    "folderStructure": [],
    "namingRules": [],
    "folderDepthLimits": [],
    "userNotes": []
  },
  "additionalInfo": {
    "stateManagement": "",
    "styling": "",
    "testing": "",
    "routing": "",
    "apiClient": ""
  }
}
```

---

## 2. Fields Explained

### Basic Metadata

| Field       | Description            | Example            |
| ----------- | ---------------------- | ------------------ |
| `framework` | Main framework used    | `"React"`          |
| `language`  | Programming language   | `"TypeScript"`     |
| `version`   | Project version        | `"1.0.0"`          |
| `author`    | Project author or team | `"Isaac Anasonye"` |

### Conventions

| Field               | Description                        | Example                                                |
| ------------------- | ---------------------------------- | ------------------------------------------------------ |
| `description`       | Short summary of project structure | `"Monorepo with shared components"`                    |
| `folderStructure`   | Key folders used                   | `["src", "components", "utils"]`                       |
| `namingRules`       | Naming conventions                 | `["PascalCase for components", "camelCase for utils"]` |
| `folderDepthLimits` | Max depth rules per folder         | `[{"src": 4}]`                                         |
| `userNotes`         | Any team notes about structure     | `["API folder contains REST endpoints"]`               |

### Additional Info

| Field             | Description               | Example                          |
| ----------------- | ------------------------- | -------------------------------- |
| `stateManagement` | State library or approach | `"Redux Toolkit"`                |
| `styling`         | CSS or styling approach   | `"Tailwind CSS"`                 |
| `testing`         | Test framework            | `"Jest + React Testing Library"` |
| `routing`         | Routing approach          | `"Next.js file-based routing"`   |
| `apiClient`       | API client used           | `"Axios"`                        |

---

## 3. Benefits

* **Document your architecture:** Everyone on the team knows the tech stack and conventions.
* **Consistency:** Reduces confusion on naming, folder depth, and file organization.
* **Integration with Scaffoldrite:** Helps Scaffoldrite generate and validate structure according to project-specific rules.

---

## 4. Example Usage

```json id="example-config"
{
  "framework": "React",
  "language": "TypeScript",
  "version": "2.1.0",
  "author": "Team Scaffold",
  "conventions": {
    "description": "React monorepo with shared components and utils",
    "folderStructure": ["src", "components", "hooks", "utils"],
    "namingRules": ["PascalCase for components", "camelCase for hooks"],
    "folderDepthLimits": [{"src": 4}],
    "userNotes": ["All API calls in src/api", "Tests under src/__tests__"]
  },
  "additionalInfo": {
    "stateManagement": "Redux Toolkit",
    "styling": "Tailwind CSS",
    "testing": "Jest + RTL",
    "routing": "React Router",
    "apiClient": "Axios"
  }
}
```

> Teams can **edit `project.json` anytime** to update conventions or document new decisions.
> Scaffoldrite reads this during `generate` and `validate` to ensure the project follows defined standards.

---

**Next up:** [Filesystem & Content Handling](../filesystem-content-handling)
