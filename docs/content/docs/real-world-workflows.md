---
title: Real-World Workflows
sidebar_position: 13
---
---

Scaffoldrite adapts to multiple **real-world development scenarios**—from solo prototyping to enterprise governance.  

Below are workflows you can follow depending on your project type.

---

## 1. The Startup: Rapid Prototyping

Start fast, iterate quickly, and enforce structure only as patterns emerge.

```bash
# Day 1: Initialize minimal structure
sr init --empty

# Edit .scaffoldrite/structure.sr with your dream structure
sr generate .

# Day 7: Add constraints as patterns emerge
# Example:
# eachFolderMustContain * src/features index.ts
# fileNameRegex src/components/ ^[A-Z][a-zA-Z]+\.tsx$

# Day 30: Validate structure to maintain consistency
sr validate
````

**Benefits:**

* Rapid iteration without worrying about structure collapse
* Constraints applied progressively as team and codebase grow

---

## 2. The Enterprise: Governance & Standards

Maintain strict standards across multiple teams or projects.

```bash
# Create a golden template
sr init --from-fs ./golden-template

# Add strict constraints in structure.sr
# Save to company template repo

# Development teams adopt template
sr init --from-fs company-templates/react-starter
sr generate .
sr validate  # Ensures compliance
```

**Benefits:**

* Enforces architectural standards across teams
* Prevents misalignment between projects
* Guarantees predictable folder and file organization

---

## 3. Open Source Maintainer: Contributor Onboarding

Ensure contributors follow consistent structure rules.

```txt
constraints {
  eachFolderMustContainFile * examples README.md
  eachFolderMustContain ** src tests
  maxFiles src/lib 20
}
```

**Workflow:**

* Contributors clone the repo
* Scaffoldrite validates structure automatically
* CI/CD pipelines enforce constraints

**Benefits:**

* Documentation is embedded in the structure itself
* Every example has docs, every module has tests, core library stays lean

---

## 4. Freelancer: Client Consistency

Keep personal templates and deliver consistent projects to clients.

```bash
# Your personal template from best project
sr init --from-fs ./best-client-project

# Generate project for new client
sr generate ./client-project --copy
```

**Benefits:**

* Every client project uses a proven structure
* Reduces onboarding/setup time for new projects
* Maintains uniformity across all client deliveries

---

## 5. Template Creator: Complete Project Templates

Create reusable project templates for your team or community.

```bash
# Template from a completed project
sr init --from-fs ./best-project

# Generate complete templates with file contents
sr generate ./project-template --copy

# Alternative: Clean starter kits
sr generate ./starter-kit --copy --ignore-tooling
```

**Benefits:**

* Team members get the **entire structure + content**
* Starter kits provide a clean slate without scaffold config
* Accelerates onboarding for new developers

---

## Key Takeaways

* Scaffoldrite supports **progressive adoption**:

  * Start minimal, grow constraints over time
* Works in **solo, team, enterprise, and open-source contexts**
* Enforces structure **without dictating content**
* Ensures **scalable, predictable, and maintainable codebases**

---

**Next up:** [Advanced Scenarios](../advanced-scenarios)
