import { preventIfStructureLocked } from "../../lib/utils/lock";
import { validateConstraints } from "../validator";
import { baseDir, loadAST, saveStructure } from "../../lib/utils";
import { deleteNode } from "../structure";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { exit } from "../../lib/utils";
import { confirmProceed } from "../../lib/utils";
import { STRUCTURE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { generateFS } from "../generator";


interface Props {
    arg3:string;
    dryRun:boolean;
    verbose:boolean;
    summary:boolean;
}

export const del = async ({arg3,dryRun,verbose,summary}:Props) => {
        await preventIfStructureLocked("delete");
        const structure = loadAST();
        validateConstraints(structure.root, structure.constraints);

        const targetPath = arg3;
        if (!targetPath) {
            console.error(theme.error.bold(`${icons.error} Error: Please provide a path to delete.`));
            exit(1);
        }

        deleteNode(structure.root, targetPath);

        validateConstraints(structure.root, structure.constraints);

        const outputDir = path.resolve(baseDir);

        // 2️⃣ Confirmation
        if (!(await confirmProceed(outputDir))) {
            console.log(theme.muted(`${icons.info} Deletion cancelled.`));
            return;
        }

        if (!dryRun) {
            saveStructure(structure.root, structure.rawConstraints, STRUCTURE_PATH);
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Skipping update to structure.sr`));
        }

        const logLines: string[] = [];
        const ignoreList = getIgnoreList();

        await generateFS(structure.root, outputDir, {
            dryRun, // This utility already handles the physical deletion logic
            ignoreList,
            onProgress(e) {
                logLines.push(`${e.type.toUpperCase()} ${e.path}`);
            },
        });

        if (verbose) {
            console.log(theme.primary.bold(`\n📋 Operations:`));
            console.log(theme.muted(`─`.repeat(40)));
            for (const line of logLines) {
                if (line.startsWith("DELETE")) {
                    console.log(theme.error(`  ${icons.cross} ${line}`));
                } else if (line.startsWith("SKIP")) {
                    console.log(theme.muted(`  ${icons.info} ${line}`));
                } else {
                    console.log(theme.info(`  ${icons.info} ${line}`));
                }
            }
        } else if (summary) {
            console.log(theme.primary.bold(`\n📊 Summary:`));
            console.log(theme.muted(`─`.repeat(40)));
            for (const line of logLines.filter(l => !l.startsWith("SKIP"))) {
                console.log(theme.error(`  ${icons.cross} ${line}`));
            }
        }

        process.stdout.write("\n");
        const status = dryRun ? theme.info("[Dry Run] Deletion simulated.") : theme.success.bold(`${icons.check} Deleted successfully.`);
        console.log(status);
        return;
    }