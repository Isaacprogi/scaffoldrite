import { preventIfStructureLocked } from "../../lib/utils/lock";
import { validateConstraints } from "../validator";
import { baseDir, loadAST, saveStructure } from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { confirmProceed } from "../../lib/utils";
import { STRUCTURE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { generateFS } from "../generator";
import { addNode } from "../structure";


interface Props {
    arg3: string;
    arg4: string;
    force: boolean;
    ifNotExists: boolean;
    dryRun: boolean;
    verbose: boolean;
    summary: boolean;
}


export const create = async ({ arg3, arg4, force, ifNotExists, dryRun, verbose, summary }: Props) => {
    await preventIfStructureLocked("create");

    const structure = loadAST();
    const outputDir = path.resolve(baseDir);

    const ignoreList = getIgnoreList();

    validateConstraints(structure.root, structure.constraints);


    const result = addNode(
        structure.root,
        arg3,
        arg4 as "file" | "folder",
        {
            force,
            ifNotExists,
        }
    );

    validateConstraints(structure.root, structure.constraints);

    if (!(await confirmProceed(outputDir))) {
        console.log(theme.muted(`${icons.info} Creation cancelled.`));
        return;
    }


    if (!dryRun) {
        saveStructure(
            structure.root,
            structure.rawConstraints,
            STRUCTURE_PATH
        );
    } else {
        console.log(
            theme.info(
                `${icons.info} [Dry Run] Skipping update to structure.sr`
            )
        );
    }

    const logLines: string[] = [];

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
                console.log(theme.success(`  ${icons.success} ${line}`));
            } else if (line.startsWith("SKIP")) {
                console.log(theme.muted(`  ${icons.info} ${line}`));
            } else {
                console.log(theme.info(`  ${icons.info} ${line}`));
            }
        }
    } else if (summary) {
        console.log(theme.primary.bold(`\n📊 Summary:`));
        console.log(theme.muted(`─`.repeat(40)));

        for (const line of logLines.filter((l) => !l.startsWith("SKIP"))) {
            console.log(theme.success(`  ${icons.success} ${line}`));
        }
    }

    process.stdout.write("\n");


    if (dryRun) {
        console.log(theme.info("[Dry Run] Creation simulated."));
    } else {
        switch (result) {
            case "skipped":
                console.log(
                    theme.warning(`${icons.info} Skipped (already exists).`)
                );
                break;

            case "replaced":
                console.log(
                    theme.success.bold(
                        `${icons.check} Replaced existing item successfully.`
                    )
                );
                break;

            case "created":
            default:
                console.log(
                    theme.success.bold(`${icons.check} Created successfully.`)
                );
                break;
        }
    }

    return;
}