import { preventIfStructureLocked } from "../../lib/utils/lock";
import { icons, theme } from "../../data";
import fs from "fs";
import { baseDir, exit, STRUCTURE_PATH } from "../../lib/utils";
import path from "path";
import { IGNORE_PATH } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { saveStructure } from "../../lib/utils";
import { FolderNode } from "../ast";
import { DEFAULT_IGNORE_TEMPLATE } from "../../data";
import { buildASTFromFS } from "../fsToAst";

interface Props {
    dryRun: any,
    empty: boolean;
    force: boolean;
    parsed: any;
    migrate: boolean;
    fromFs: boolean;
    arg3: string;
}


export const init = async ({ dryRun, empty, force, parsed, migrate, fromFs, arg3 }: Props) => {
    await preventIfStructureLocked("init");
    const shouldOverwrite = force;
    const sDir = path.join(baseDir, ".scaffoldrite");

    if (!fs.existsSync(sDir)) {
        if (!dryRun) {
            fs.mkdirSync(sDir, { recursive: true });
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Would create directory: .scaffoldrite`));
        }
    }

    const projectConfig = path.join(sDir, "project.json");

    const legacyStructure = path.join(baseDir, "structure.sr");
    const legacyIgnore = path.join(baseDir, ".scaffoldignore");

    const structureExists = fs.existsSync(STRUCTURE_PATH);
    const ignoreExists = fs.existsSync(IGNORE_PATH);
    const projectExists = fs.existsSync(projectConfig);

    const existingConfigs = [];
    if (structureExists) existingConfigs.push("structure.sr");
    if (ignoreExists) existingConfigs.push(".scaffoldignore");
    if (projectExists) existingConfigs.push("project.json");

    if (!shouldOverwrite && existingConfigs.length > 0) {
        console.error(
            theme.error.bold(`${icons.error} The following files already exist:\n`) +
            existingConfigs.map(f => theme.muted(`  - ${f}`)).join("\n") +
            theme.warning(`\n\nUse --force to overwrite everything.`)
        );
        exit(1);
    }

    if (migrate) {
        let migrated = false;
        if (fs.existsSync(legacyStructure)) {
            if (!dryRun) {
                fs.renameSync(legacyStructure, STRUCTURE_PATH);
                console.log(theme.success(`${icons.check} Moved structure.sr → .scaffoldrite/structure.sr`));
            } else {
                console.log(theme.info(`${icons.info} [Dry Run] Would move structure.sr → .scaffoldrite/structure.sr`));
            }
            migrated = true;
        }
        if (fs.existsSync(legacyIgnore)) {
            if (!dryRun) {
                fs.renameSync(legacyIgnore, IGNORE_PATH);
                console.log(theme.success(`${icons.check} Moved .scaffoldignore → .scaffoldrite/.scaffoldignore`));
            } else {
                console.log(theme.info(`${icons.info} [Dry Run] Would move .scaffoldignore → .scaffoldrite/.scaffoldignore`));
            }
            migrated = true;
        }
        if (!migrated) console.log(theme.info(`${icons.info} No legacy config found to migrate.`));
        return;
    }

    if (empty) {
        const root: FolderNode = { type: "folder", name: ".", children: [] };
        if (!dryRun) {
            saveStructure(root, parsed.rawConstraints, STRUCTURE_PATH);
            if (shouldOverwrite || !fs.existsSync(IGNORE_PATH)) {
                fs.writeFileSync(IGNORE_PATH, DEFAULT_IGNORE_TEMPLATE);
            }
            console.log(theme.success(`${icons.success} Empty structure.sr created`));
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Would create empty structure.sr and .scaffoldignore`));
        }
    } else if (fromFs) {
        const targetDir = path.resolve(arg3 ?? baseDir);
        const ignoreList = getIgnoreList();
        console.log(ignoreList)
        const ast = buildASTFromFS(targetDir, ignoreList);
        if (!dryRun) {
            saveStructure(ast, parsed.rawConstraints, STRUCTURE_PATH);
            if (shouldOverwrite || !fs.existsSync(IGNORE_PATH)) {
                fs.writeFileSync(IGNORE_PATH, DEFAULT_IGNORE_TEMPLATE);
            }
            console.log(theme.success(`${icons.success} structure.sr generated from filesystem: `) + theme.light(targetDir));
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Would generate structure.sr from filesystem: ${targetDir}`));
        }
    } else {
        if (!dryRun) {
            saveStructure(parsed.root, parsed.rawConstraints, STRUCTURE_PATH);
            if (shouldOverwrite || !fs.existsSync(IGNORE_PATH)) {
                fs.writeFileSync(IGNORE_PATH, DEFAULT_IGNORE_TEMPLATE);
            }
            console.log(theme.success(`${icons.success} structure.sr created`));
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Would create structure.sr and .scaffoldignore`));
        }
    }

    if (shouldOverwrite || !fs.existsSync(projectConfig)) {
        if (!dryRun) {
            fs.writeFileSync(
                projectConfig,
                JSON.stringify({
                    framework: "",
                    language: "",
                    version: "1.0.0",
                    author: "",
                    conventions: {
                        description: "",
                        folderStructure: [],
                        namingRules: [],
                        folderDepthLimits: [],
                        userNotes: []
                    },
                    additionalInfo: {
                        stateManagement: "",
                        styling: "",
                        testing: "",
                        routing: "",
                        apiClient: ""
                    },
                }, null, 2)
            );
            console.log(theme.info(`${icons.info} Created project config: project.json`));
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Would create project config: project.json`));
        }
    }

    if (dryRun) {
        console.log(theme.primary.bold(`\n${icons.info} [Dry Run] Init simulation complete. No files were changed.`));
    }

    return;
}