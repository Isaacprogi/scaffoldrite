Here’s a **simplified GitHub README** version of your Scaffoldrite docs, keeping it clean and pointing users to the docs site:

---

# Scaffoldrite: Define. Enforce. Generate.

> *Structure the right way*

**Stop guessing. Start structuring.**
Your project’s architecture should be as reliable as your code. Scaffoldrite makes it enforceable.

---

![ScaffoldRite Banner](https://raw.githubusercontent.com/isaacprogi/scaffoldrite/main/public/scaffoldrite-banner.png)

---

## 🚀 What is Scaffoldrite?

Scaffoldrite is a CLI tool that lets you:

* Define your project structure in a single file (`structure.sr`)
* Enforce architecture rules with constraints
* Generate and validate consistent project layouts
* Prevent structural chaos before it starts

---

## ⚡ Quick Start

```bash
npm install -g scaffoldrite
```

```bash
sr init
sr generate .
```

That’s it. Your structure becomes reality.

---

## 📁 Core Idea

You define your project like this:

```sr
folder src {
  folder components {
    file Button.tsx
  }
  file index.ts
}

constraints {
  mustContain src index.ts
}
```

Scaffoldrite ensures your filesystem always matches this blueprint.

---

## 🧠 Key Features

* 🏗 Declarative project structure (`structure.sr`)
* 🧱 Strong structural constraints (lint your folders)
* ⚙ CLI-first workflow (init, generate, validate, update)
* 🔁 Sync between filesystem and structure definition
* 📦 Template generation for real-world projects

---

## 🛠 Common Commands

```bash
sr init                # create structure blueprint
sr generate .          # generate project structure
sr validate            # check compliance
sr update --from-fs .  # sync from filesystem
sr find Button         # search structure
```

---

## 📦 Config Location (v2+)

```
.scaffoldrite/
├─ structure.sr
└─ .scaffoldignore
```

---

## 📖 Documentation

Full documentation, guides, constraints reference, and advanced usage:

👉 **[https://github.com/isaacprogi/scaffoldrite](https://github.com/isaacprogi/scaffoldrite)**

---

## 🤝 Community

* ⭐ Star the project: [https://github.com/Isaacprogi/scaffoldrite](https://github.com/Isaacprogi/scaffoldrite)
* 🐛 Report issues: [https://github.com/Isaacprogi/scaffoldrite/issues](https://github.com/Isaacprogi/scaffoldrite/issues)
* 💬 Discussions: [https://github.com/Isaacprogi/scaffoldrite/discussions](https://github.com/Isaacprogi/scaffoldrite/discussions)

---

## 📄 License

MIT

---

**Build structure like you build code — intentionally.**

*Happy structuring 🏗️*
