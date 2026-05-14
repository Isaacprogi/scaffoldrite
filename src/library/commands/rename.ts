import { preventIfStructureLocked } from "../../lib/utils/lock";
import { validateConstraints } from "../validator";
import { baseDir, loadAST, saveStructure } from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { exit } from "../../lib/utils";
import { confirmProceed } from "../../lib/utils";
import { STRUCTURE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { generateFS } from "../generator";
import { renameFSItem } from "../../lib/utils";
import { renameNode } from "../structure";


interface Props {
    arg3: string;
    arg4: string;
    force: boolean;
    dryRun: boolean;
    verbose: boolean;
    summary: boolean;
}

export const rename = async ({ arg3, arg4, dryRun, summary, verbose }: Props) => {
    await preventIfStructureLocked("rename");

    const structure = loadAST();
    const oldPath = arg3;
    const newName = arg4;
    const outputDir = path.resolve(baseDir);

    if (!oldPath || !newName) {
        console.error(theme.error.bold(`${icons.error} Error: Missing arguments. Usage: rename <path> <newName>`));
        exit(1);
    }

    validateConstraints(structure.root, structure.constraints);

    const oldFullPath = path.join(outputDir, oldPath);
    const newFullPath = path.join(outputDir, path.join(path.dirname(oldPath), newName));

    renameNode(structure.root, oldPath, newName);

    validateConstraints(structure.root, structure.constraints);

    if (!(await confirmProceed(outputDir))) {
        console.log(theme.muted(`${icons.info} Rename cancelled.`));
        return;
    }

    if (!dryRun) {
        saveStructure(structure.root, structure.rawConstraints, STRUCTURE_PATH);
    } else {
        console.log(theme.info(`${icons.info} [Dry Run] Would update ${STRUCTURE_PATH}`));
    }

    if (!dryRun) {
        const renamed = renameFSItem(oldFullPath, newFullPath);
        if (!renamed) {
            console.warn(theme.warning(`${icons.warning} Warning: Item not found in filesystem, will create new based on structure.sr.`));
        }
    } else {
        console.log(theme.info(`${icons.info} [Dry Run] Would rename ${oldPath} → ${newName}`));
    }

    const logLines: string[] = [];
    const ignoreList = getIgnoreList();

    await generateFS(structure.root, outputDir, {
        dryRun, 
        ignoreList,
        onProgress(e) {
            logLines.push(`${e.type.toUpperCase()} ${e.path}`);
        },
    });

    if (verbose) {
        console.log(theme.primary.bold(`\n📋 Operations:`));
        console.log(theme.muted(`─`.repeat(40)));
        for (const line of logLines) {
            if (line.startsWith("CREATE")) {
                console.log(theme.success(`  ${icons.success} ${line}`));
            } else if (line.startsWith("DELETE")) {
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
            if (line.startsWith("CREATE")) {
                console.log(theme.success(`  ${icons.success} ${line}`));
            } else if (line.startsWith("DELETE")) {
                console.log(theme.error(`  ${icons.cross} ${line}`));
            }
        }
    }
    
    process.stdout.write("\n");
    const status = dryRun ? theme.info("[Dry Run] Rename simulated.") : theme.success.bold(`${icons.check} Renamed successfully.`);
    console.log(status);
    return;
}