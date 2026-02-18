import fs from "fs";
import path from "path";
import { FolderNode, FileNode } from "./ast";
import { theme, icons } from "../data";

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
