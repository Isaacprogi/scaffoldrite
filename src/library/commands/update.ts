import { preventIfStructureLocked } from "../../lib/utils/lock";
import { icons, theme } from "../../data";
import fs from "fs";
import { baseDir, exit, STRUCTURE_PATH } from "../../lib/utils";
import path from "path";
import { getIgnoreList } from "../../lib/utils";
import { saveStructure } from "../../lib/utils";
import { buildASTFromFS } from "../fsToAst";
import { confirmProceed } from "../../lib/utils";
import { loadConstraints } from "../../lib/utils";

interface Props {
    dryRun: any,
    arg3: string;
}

export const update = async ({ arg3, dryRun }: Props) => {
    await preventIfStructureLocked("update");
    if (!fs.existsSync(STRUCTURE_PATH)) {
        console.error(theme.error.bold(`${icons.error} Error: structure.sr not found. Run \`scaffoldrite init\` first.`));
        exit(1);
    }

    const targetDir = path.resolve(arg3 ?? baseDir);

    const ignoreList = getIgnoreList();
    const ast = buildASTFromFS(targetDir, ignoreList);


    const constraints = loadConstraints();

    if (!(await confirmProceed(targetDir))) {
        console.log(theme.muted(`${icons.info} Update cancelled.`));
        return;
    }

    if (!dryRun) {
        saveStructure(ast, constraints, STRUCTURE_PATH);
        console.log(theme.success(`${icons.success} structure.sr updated from filesystem: `) + theme.light(targetDir));
    } else {
        console.log(theme.info(`${icons.info} [Dry Run] Would update structure.sr based on: `) + theme.light(targetDir));
        console.log(theme.muted(`   (No changes were written to the disk)`));
    }

    return;
}