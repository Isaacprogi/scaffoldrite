---
title: 🔓 unlock
sidebar_position: 9
---

The `unlock` command removes restrictions previously applied by the `lock` command.

It restores normal project behavior for Git workflows, structure enforcement, CI rules, or configuration constraints.

---

## Usage

```bash
sr unlock [flags]
```

---

## Unlock Types (Flags)

| Flag          | Description                                | Example                 |
| ------------- | ------------------------------------------ | ----------------------- |
| `--git`       | Removes Git workflow hooks and protections | `sr unlock --git`       |
| `--structure` | Disables structure enforcement rules       | `sr unlock --structure` |
| `--ci`        | Disables CI-level structure validation     | `sr unlock --ci`        |

---

## Behavior

* Only **one unlock type is executed per command run**

* Flags are evaluated in order:

  1. `--git`
  2. `--structure`
  3. `--ci`

* If no flag is provided, available options are displayed.

---

## Examples

### Unlock Git workflow

```bash id="unlock_git_01"
sr unlock --git
```

Removes Git hooks and disables pre-push or pre-commit enforcement.

---

### Unlock project structure

```bash id="unlock_structure_01"
sr unlock --structure
```

Allows manual filesystem changes without structure validation blocking them.

---

### Disable CI enforcement

```bash id="unlock_ci_01"
sr unlock --ci
```

Turns off CI-based structure validation during builds and deployments.

---

## Notes

* Unlocking does **not delete hooks or configurations** — it only disables enforcement behavior.
* Use carefully in shared or production environments to avoid breaking structure consistency.
* Unlocking restores full flexibility to the project.

---

## Related Commands

* `lock` — Apply project restrictions
* `validate` — Check structure integrity
* `deps` — Analyze project dependency graph
