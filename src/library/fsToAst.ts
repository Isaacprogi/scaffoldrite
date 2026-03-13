import fs from "fs";
import path from "path";
import { FolderNode, FileNode } from "./ast";
import { theme, icons } from "../data";
import { execSync } from "child_process";

export function buildASTFromFS(
  dir: string,
  ignoreList: string[] = []
): FolderNode {

  if (!fs.existsSync(dir)) {
    throw new Error(
      `${icons.error} ${theme.error("Directory not found:")} ${theme.highlight(dir)}\n` +
      `${theme.info("Tip:")} Make sure the directory exists or create it with ${theme.primary(`mkdir -p "${dir}"`)}`
    );
  }

  const root: FolderNode = {
    type: "folder",
    name: path.basename(dir),
    children: [],
  };

  const isScaffoldriteInternal = (p: string) => {
    const rel = path.relative(dir, p);
    return rel === ".scaffoldrite" || rel.startsWith(".scaffoldrite" + path.sep);
  };

  function scan(folderPath: string, node: FolderNode) {

    const items = fs.readdirSync(folderPath);

    // 🔥 SORTING LOGIC (folders first, then alphabetical)
    const sortedItems = items
      .map((item) => {
        const itemPath = path.join(folderPath, item);
        const stat = fs.statSync(itemPath);

        return {
          name: item,
          path: itemPath,
          isDirectory: stat.isDirectory(),
        };
      })
      .sort((a, b) => {
        // 1️⃣ Folders first
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;

        // 2️⃣ Alphabetical (case-insensitive)
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });

    for (const item of sortedItems) {

      if (ignoreList.includes(item.name)) continue;
      if (isScaffoldriteInternal(item.path)) continue;

      if (item.isDirectory) {
        const childFolder: FolderNode = {
          type: "folder",
          name: item.name,
          children: [],
        };

        node.children.push(childFolder);
        scan(item.path, childFolder);

      } else {
        const childFile: FileNode = {
          type: "file",
          name: item.name,
        };

        node.children.push(childFile);
      }
    }
  }

  scan(dir, root);
  return root;
}



export function buildASTFromGit(
  ref: string,
  ignoreList: string[] = []
): FolderNode {
  try {
    // 1. Get all files tracked at that ref (recursive)
    // -r: recursive, --name-only: paths only
    const output = execSync(`git ls-tree -r --name-only ${ref}`, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'] // Prevents git errors from polluting stdout
    });
    
    const files = output.split('\n').filter(Boolean);

    const root: FolderNode = {
      type: "folder",
      name: ref, // Named after the branch/ref
      children: [],
    };

    // 2. Helper to insert paths into the tree structure
    const insertPath = (filePath: string) => {
      const parts = filePath.split('/');
      let currentNode = root;

      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        const isLast = i === parts.length - 1;

        // Skip ignored items
        if (ignoreList.includes(name)) return;

        if (isLast) {
          // Add as File
          const childFile: FileNode = { type: "file", name };
          currentNode.children.push(childFile);
        } else {
          // Find or Create Folder
          let folder = currentNode.children.find(
            (child) => child.type === "folder" && child.name === name
          ) as FolderNode;

          if (!folder) {
            folder = { type: "folder", name, children: [] };
            currentNode.children.push(folder);
          }
          currentNode = folder;
        }
      }
    };

    files.forEach(insertPath);

    // 3. RECURSIVE SORTING (Matching your buildASTFromFS logic)
    const sortTree = (node: FolderNode) => {
      node.children.sort((a, b) => {
        // 1️⃣ Folders first
        const aIsDir = a.type === "folder";
        const bIsDir = b.type === "folder";
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

        // 2️⃣ Alphabetical (case-insensitive)
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });

      // Recurse into folders
      for (const child of node.children) {
        if (child.type === "folder") {
          sortTree(child);
        }
      }
    };

    sortTree(root);
    return root;

  } catch (error) {
    throw new Error(
      `${icons.error} ${theme.error("Git error for ref:")} ${theme.highlight(ref)}\n` +
      `${theme.info("Note:")} Ensure the ref exists and you are running this inside a git repo.`
    );
  }
}