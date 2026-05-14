import fs from "fs";
import path from "path";
import { FolderNode, FileNode } from "./ast";
import { theme, icons } from "../data";
import { execSync } from "child_process";
import { minimatch } from 'minimatch';

function isIgnored(filePath: string, baseDir: string, ignoreList: string[]): boolean {
  const relativePath = path.relative(baseDir, filePath);
  const normalizedRelPath = relativePath.replace(/[\\/]/g, '/');
  
  return ignoreList.some(pattern => {
    const normalizedPattern = pattern.replace(/[\\/]/g, '/');
    
    // Check if pattern matches the relative path (for nested paths)
    if (normalizedPattern.includes('/')) {
      return minimatch(normalizedRelPath, normalizedPattern);
    }
    
    // For simple names, check basename
    return path.basename(filePath) === pattern;
  });
}

function isScaffoldriteInternal(dir: string, p: string) {
  const rel = path.relative(dir, p);
  return rel === ".scaffoldrite" || rel.startsWith(".scaffoldrite" + path.sep);
}

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

  function scan(folderPath: string, node: FolderNode) { 
    const items = fs.readdirSync(folderPath);

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
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });

    for (const item of sortedItems) {
      if (isIgnored(item.path, dir, ignoreList)) continue;
      if (isScaffoldriteInternal(dir, item.path)) continue;

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
    const output = execSync(`git ls-tree -r --name-only ${ref}`, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'] 
    });
    
    const files = output.split('\n').filter(Boolean);

    const root: FolderNode = {
      type: "folder",
      name: ref,
      children: [],
    };

    const insertPath = (filePath: string) => {
      const parts = filePath.split('/');
      let currentNode = root;

      for (let i = 0; i < parts.length; i++) {
        const name = parts[i];
        const currentPath = parts.slice(0, i + 1).join('/');
        const isLast = i === parts.length - 1;

        // Check if this path segment should be ignored
        if (isIgnored(currentPath, '', ignoreList)) return;
        
        // Also check individual name against simple patterns
        const isNameIgnored = ignoreList.some(pattern => {
          const normalizedPattern = pattern.replace(/[\\/]/g, '/');
          return !normalizedPattern.includes('/') && name === pattern;
        });
        
        if (isNameIgnored) return;

        if (isLast) {
          const childFile: FileNode = { type: "file", name };
          currentNode.children.push(childFile);
        } else {
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

    const sortTree = (node: FolderNode) => {
      node.children.sort((a, b) => {
        const aIsDir = a.type === "folder";
        const bIsDir = b.type === "folder";
        if (aIsDir && !bIsDir) return -1;
        if (!aIsDir && bIsDir) return 1;

        return a.name.localeCompare(b.name, undefined, {
          sensitivity: "base",
        });
      });

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