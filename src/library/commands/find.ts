import { baseDir, loadAST} from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { exit } from "../../lib/utils";
import { STRUCTURE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { loadASTFromRef } from "../../lib/utils";
import { printUsage } from "../../lib/utils";
import { buildASTFromFS,buildASTFromGit } from "../fsToAst";
import { FolderNode } from "../ast";
import fs from "fs";


interface Props {
    arg3:string;
    isStructure:boolean;
    isFS:boolean;
    againstValue:string;
    hasAgainst:boolean;
}
 
 export const find = async ({arg3,isFS,isStructure,hasAgainst,againstValue}:Props) => {
        let structure;

        const searchQuery = arg3;
        if (!searchQuery) {
            console.error(theme.error.bold(`${icons.error} Please provide a file, folder, or path to find.`));
            printUsage("find");
            exit(1);
        }

        const results: string[] = [];
        const ignoreList = getIgnoreList();

        const searchStructure = isStructure || (!isStructure && !isFS);
        const searchFilesystem = isFS || (!isStructure && !isFS);

        !isStructure && !isFS &&
            console.log(
                theme.info(
                    `${icons.info} Searching both structure.sr and filesystem for: ${theme.highlight(searchQuery)} from ${hasAgainst ? againstValue : "current state"
                    }${theme.muted("\nUse --structure or --fs to search a specific source.")}`
                )
            );

        if (searchStructure && fs.existsSync(STRUCTURE_PATH)) {
            if (hasAgainst) {
                structure = loadASTFromRef(againstValue);
                isStructure && console.log(theme.info(`${icons.info} Searching structure.sr from ${againstValue}`));
            } else {
                structure = loadAST();
            }


            function searchAST(node: FolderNode, currentPath = "") {
                for (const child of node.children) {
                    const childPath = path.posix.join(currentPath, child.name);
                    if (child.name.includes(searchQuery) || childPath.includes(searchQuery)) {
                        results.push(`${icons.file} [structure] ${childPath}`);
                    }
                    if (child.type === "folder") {
                        searchAST(child, childPath);
                    }
                }
            }
            searchAST(structure.root);
        }

        if (searchFilesystem) {
            isFS && console.log(theme.info(`${icons.info} Searching filesystem from ${hasAgainst ? againstValue : "current state"}`));
            const fsAst = hasAgainst
                ? buildASTFromGit(againstValue, ignoreList)
                : buildASTFromFS(baseDir, ignoreList);

            function searchFSAST(node: FolderNode, currentPath = "") {
                for (const child of node.children) {
                    const childPath = path.posix.join(currentPath, child.name);
                    if (child.name.includes(searchQuery) || childPath.includes(searchQuery)) {
                        results.push(`${icons.folder} [fs] ${childPath}`);
                    }
                    if (child.type === "folder") {
                        searchFSAST(child, childPath);
                    }
                }
            }
            searchFSAST(fsAst);
        }
        if (results.length === 0) {
            console.log(theme.warning(`${icons.warning} Could not find '${searchQuery}' in the selected scope.`));
            return;
        }

        console.log(theme.primary.bold(`\nFound ${results.length} match(es) for '${searchQuery}':`));
        results.forEach(r => console.log(theme.light(`  ${r}`)));
    }