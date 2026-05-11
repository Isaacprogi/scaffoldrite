import { icons, theme } from "../../data";
import fs from "fs";
import { baseDir, exit, STRUCTURE_PATH } from "../../lib/utils";
import path from "path";
import { getIgnoreList } from "../../lib/utils";
import { buildASTFromFS, buildASTFromGit } from "../fsToAst";
import { loadAST, loadASTFromRef, filterTreeByIgnore, printTree, flattenTree } from "../../lib/utils";
import { printTreeWithIcons } from "../../lib/utils";

interface Props {
    isFS: boolean;
    isDiff: boolean;
    isStructure: boolean;
    againstValue: string;
    hasAgainst: boolean;
    withIcons: boolean;
}

export const list = async ({ isFS, isDiff, isStructure, againstValue, hasAgainst, withIcons }: Props) => {

    const isDefault = !isFS && !isDiff && !isStructure;

    const targetDir = path.resolve(baseDir);

    let structure;

    if (hasAgainst) {
        structure = loadASTFromRef(againstValue);
        console.log(theme.info(`${icons.info} Retrieving list from ${againstValue}`));
    } else {
        structure = loadAST();
        console.log(theme.info(`${icons.info} Loading default list structure`));
    }

    if (isDefault) {
        if (!fs.existsSync(STRUCTURE_PATH)) {
            console.error(theme.error.bold(`${icons.error} structure.sr not found. Run \`scaffoldrite init\` first.`));
            exit(1);
        }



        console.log(theme.primary.bold(`${icons.file} structure.sr\n`));
        if (withIcons) {
            printTreeWithIcons(structure.root);
        } else {
            printTree(structure.root)
        }
        return;
    }

    const ignoreList = getIgnoreList();

    if (isStructure) {
        if (!fs.existsSync(STRUCTURE_PATH)) {
            console.error(theme.error.bold(`${icons.error} structure.sr not found. Run \`scaffoldrite init\` first.`));
            exit(1);
        }
        const filtered = filterTreeByIgnore(structure.root, ignoreList);

        console.log(theme.primary.bold(`${icons.file} structure.sr`));
        console.log(theme.muted(`Ignoring: `) + theme.accent(ignoreList.join(", ")) + theme.muted(`\n`));

        if (filtered) {
            printTreeWithIcons(structure.root);
        } else {
            printTree(structure.root)
        }

        return;
    }

    if (isFS) {
        const fsAst = hasAgainst
            ? buildASTFromGit(againstValue, ignoreList)
            : buildASTFromFS(targetDir, ignoreList);

        console.log(theme.secondary.bold(`${icons.folder} filesystem (`) + theme.light(targetDir) + theme.secondary.bold(`)`));
        console.log(theme.muted(`Ignoring: `) + theme.accent(ignoreList.join(", ")) + theme.muted(`\n`));

        if (withIcons) {
            printTreeWithIcons(fsAst);
        } else {
            printTree(fsAst)
        }
        return;
    }

    if (isDiff) {
        if (!fs.existsSync(STRUCTURE_PATH)) {
            console.error(theme.error.bold(`${icons.error} structure.sr not found. Run \`scaffoldrite init\` first.`));
            exit(1);
        }


        const filteredStructure = filterTreeByIgnore(structure.root, ignoreList);
        const fsAst = buildASTFromFS(targetDir, ignoreList);

        const structMap = flattenTree(filteredStructure);
        const fsMap = flattenTree(fsAst);

        console.log(theme.highlight.bold(`${icons.file} structure.sr ${icons.arrow} ${icons.folder} filesystem diff`));
        console.log(theme.muted(`Ignoring: `) + theme.accent(ignoreList.join(", ")) + theme.muted(`\n`));

        for (const p of Array.from(
            new Set([...structMap.keys(), ...fsMap.keys()])
        ).sort()) {
            const inStruct = structMap.has(p);
            const inFS = fsMap.has(p);

            if (inStruct && !inFS) {
                console.log(theme.error(`❌ Missing in filesystem: `) + theme.light(p));
            } else if (!inStruct && inFS) {
                console.log(theme.warning(`➕ Extra in filesystem: `) + theme.light(p));
            }
        }

        return;
    }
}