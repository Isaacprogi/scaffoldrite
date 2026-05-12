import { preventIfStructureLocked } from "../core/lock";
import { baseDir, loadAST, saveStructure } from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { confirmProceed } from "../../lib/utils";
import { STRUCTURE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { exit } from "../../lib/utils";
import { buildASTFromFS } from "../fsToAst";
import { FolderNode } from "../ast";
import fs from "fs";

interface Props {
    arg3: string;
    dryRun: boolean;
}

export const merge = async ({ arg3, dryRun }: Props) => {
    await preventIfStructureLocked("merge");

    if (!fs.existsSync(STRUCTURE_PATH)) {
        console.error(theme.error.bold(`${icons.error} Error: structure.sr not found. Run \`scaffoldrite init\` first.`));
        exit(1);
    }

    const targetDir = path.resolve(arg3 ?? baseDir);

    const ignoreList = getIgnoreList();
    const fsAst = buildASTFromFS(targetDir, ignoreList);
    const structure = loadAST();

    const mergeNodes = (existing: FolderNode, incoming: FolderNode) => {
        for (const child of incoming.children) {
            if (child.type === "folder") {
                const found = existing.children.find(
                    (c) => c.type === "folder" && c.name === child.name
                ) as FolderNode | undefined;

                if (found) mergeNodes(found, child);
                else existing.children.push(child);
            } else {
                const exists = existing.children.some(
                    (c) => c.type === "file" && c.name === child.name
                );
                if (!exists) existing.children.push(child);
            }
        }
    };

    mergeNodes(structure.root, fsAst);


    if (!(await confirmProceed(targetDir))) {
        console.log(theme.muted(`${icons.info} Merge cancelled.`));
        return;
    }

    // 🛡️ Guard the final save with dryRun
    if (!dryRun) {
        saveStructure(structure.root, structure.rawConstraints, STRUCTURE_PATH);
        console.log(theme.success(`${icons.success} structure.sr merged with filesystem: `) + theme.light(targetDir));
    } else {
        console.log(theme.info(`${icons.info} [Dry Run] Would merge filesystem changes from ${theme.light(targetDir)} into structure.sr`));
        console.log(theme.muted(`   (The merge was computed in memory but not saved)`));
    }

    return;
}