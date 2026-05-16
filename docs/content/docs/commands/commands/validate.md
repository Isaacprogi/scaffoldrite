---
title: ✅ validate
sidebar_position: 2
---
---

The `validate` command **checks that your project structure follows all constraints** and that the filesystem matches `structure.sr`.

It ensures that:

* All required folders and files exist.
* Naming rules are respected.
* Extra files or missing files are reported (depending on your configuration).

You can also validate against a **git reference**.

---

## Usage

```bash
sr validate [flags]
```

---

## Flags

| Flag                    | Description                              | Example                                |
| ----------------------- | ---------------------------------------- | -------------------------------------- |
| `--against <ref>`       | Validate against a **git reference**     | `sr validate --against origin/main`    |
| `--allow-extra`         | Allow extra files in the filesystem      | `sr validate --allow-extra`            |
| `--allow-extra <paths>` | Allow extra files only in specific paths | `sr validate --allow-extra src,assets` |

---

## Git Reference (`--against`)

The `--against <ref>` flag allows you to validate your structure against a specific git reference.

**Valid references include:**

* Branch names (local or remote)

  ```bash
  sr validate --against main
  sr validate --against origin/develop
  ```
* Tags

  ```bash
  sr validate --against v1.2.3
  ```
* Commit hashes (full or short)

  ```bash
  sr validate --against a1b2c3d
  sr validate --against a1b2c3d4e5f6g7h8i9j0
  ```
* Relative commit references

  ```bash
  sr validate --against HEAD~1
  sr validate --against HEAD~3
  ```
* Any valid git ref that `git show` can resolve

**Notes:**

* Scaffoldrite will attempt to read `.scaffoldrite/structure.sr` from the given reference.
* Errors will appear if the ref does not exist or the structure file is missing at that commit.
* Use `git fetch origin` to ensure remote branches and tags are up to date.

---

## Examples

### Validate current project structure

```bash
sr validate
```

* Checks `structure.sr` against the current filesystem.
* Reports errors if constraints are violated.

---

### Validate against a git reference

```bash
sr validate --against HEAD~1
```

* Checks structure against a previous commit or branch.
* Useful for ensuring historical consistency.

---

### Allow extra files in specific paths

```bash
sr validate --allow-extra src,assets
```

* Allows extra files in the `src` and `assets` folders without throwing errors.

---

## Notes

* Validation ensures your **project constraints are consistent**.
* Errors will be displayed if files/folders are missing or constraints are broken.
* Use `--against` to validate against **past commits, branches, or tags**.

---

## Related Commands

* `generate` — Create or update filesystem from structure.sr
* `update` — Update structure.sr from filesystem
* `list` — View the structure and filesystem
* `find` — Search for files or folders
