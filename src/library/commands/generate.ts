import { preventIfStructureLocked } from "../../lib/utils/lock";
import { validateConstraints } from "../validator";
import { baseDir, loadAST} from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { confirmProceed } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { generateFS } from "../generator";
import { loadASTFromRef } from "../../lib/utils";
import { hasFlag } from "../../lib/utils";
import { warnIgnoreToolingUsage } from "../../lib/utils";
import fs from "fs";
import { execSync } from "child_process";


interface Props {
    arg3:string;
    againstValue:string;
    hasAgainst:boolean;
    isLocalAst:boolean;
    bar:any;
    dryRun:boolean;
    ignoreTooling:boolean;
    copyContents:boolean;
    verbose:boolean;
    summary:boolean;
}
 
 
 export const generate = async ({arg3,againstValue,hasAgainst,isLocalAst,dryRun,ignoreTooling,copyContents,verbose,summary,bar}:Props) => {
        await preventIfStructureLocked("generate");

        let structure;
        if (hasAgainst && !isLocalAst) {
            structure = loadASTFromRef(againstValue);
            console.log(theme.info(`${icons.info} Generating from AST of ${againstValue}`));
        } else {
            structure = loadAST();
            if (hasAgainst) {
                console.log(theme.info(`${icons.info} Using local AST, referencing files from ${againstValue}`));
            }
        }

        validateConstraints(structure.root, structure.constraints);

        const outputDir = path.resolve(arg3 ?? baseDir);
        // const warnoutDir = path.resolve(arg3 ?? baseDir);

        // warnCopyWithoutOutput(hasFlag('--copy'), warnoutDir);

        const proceed = await warnIgnoreToolingUsage(ignoreTooling, outputDir, baseDir);

        if (!proceed) {
            console.log(theme.info("Operation cancelled."));
            process.exit(0);
        }

        if (!(await confirmProceed(outputDir))) {
            console.log(theme.muted(`${icons.info} Generation cancelled.`));
            return;
        }

        const ignoreList = getIgnoreList();
        const logLines: string[] = [];
        let totalOps = 0;

        const failedFiles = await generateFS(structure.root, outputDir, {
            dryRun,
            ignoreList,
            copyContents,
            ref: hasAgainst ? againstValue : undefined,
            force: hasFlag("--force"),
            onStart(total) {
                totalOps = total;
                bar.start(total);
            },
            onProgress(e) {
                bar.update({
                    type: e.type.toUpperCase(),
                    path: e.path,
                    count: e.count,
                });
                logLines.push(`${e.type.toUpperCase()} ${e.path}`);
            },
        });

        bar.stop();

        if (failedFiles.length > 0) {
            console.log(`\n${icons.warning} ${theme.warning("Note:")} Some files could not be retrieved from git "${againstValue}":`);
            failedFiles.forEach(file => {
                console.log(`  ${theme.muted("-")} ${theme.highlight(file)} ${theme.muted("(created empty file)")}`);
            });
            console.log(theme.muted("Tip: This usually happens with gitignored files or files not present in that commit.\n"));
        }

        const scaffoldOutput = path.join(outputDir, '.scaffoldrite');

        if (!dryRun) {
            if (ignoreTooling) {
                if (fs.existsSync(scaffoldOutput)) {
                    fs.rmSync(scaffoldOutput, {
                        recursive: true,
                        force: true,
                    });
                }
            } else {
                if (hasAgainst) {
                    const folderInGit = ".scaffoldrite";
                    const destFolder = path.resolve(outputDir);

                    try {
                        execSync(`git archive ${againstValue} ${folderInGit} | tar -x -C ${destFolder}`, {
                            stdio: ["ignore", "ignore", "ignore"],
                        });
                        console.log(theme.success(`${icons.check} Successfully synced metadata from ${againstValue}`));
                    } catch (err) {
                        // If syncing metadata fails, we just ensure the dir exists
                        const scaffoldDir = path.join(outputDir, ".scaffoldrite");
                        if (!fs.existsSync(scaffoldDir)) fs.mkdirSync(scaffoldDir, { recursive: true });
                    }
                } else {
                    const scaffoldDir = path.join(outputDir, ".scaffoldrite");
                    if (!fs.existsSync(scaffoldDir)) fs.mkdirSync(scaffoldDir, { recursive: true });

                    const structureSrc = path.join(process.cwd(), ".scaffoldrite", "structure.sr");
                    const ignoreSrc = path.join(process.cwd(), ".scaffoldrite", ".scaffoldignore");
                    const projectSrc = path.join(process.cwd(), ".scaffoldrite", "project.json");
                    const settingsSrc = path.join(process.cwd(), ".scaffoldrite", "settings.json");

                    if (fs.existsSync(structureSrc)) fs.copyFileSync(structureSrc, path.join(scaffoldDir, "structure.sr"));
                    if (fs.existsSync(ignoreSrc)) fs.copyFileSync(ignoreSrc, path.join(scaffoldDir, ".scaffoldignore"));
                    if (fs.existsSync(projectSrc)) fs.copyFileSync(projectSrc, path.join(scaffoldDir, "project.json"));
                    if (fs.existsSync(settingsSrc)) fs.copyFileSync(settingsSrc, path.join(scaffoldDir, "settings.json"));
                }
            }
        } else {
            console.log(theme.info(`${icons.info} [Dry Run] Skipping metadata sync and .scaffoldrite directory creation.`));
        }

        if (verbose) {
            console.log(theme.primary.bold(`\n📋 Detailed Operations:`));
            console.log(theme.muted(`─`.repeat(40)));
            for (const line of logLines) {
                if (line.startsWith("CREATE")) {
                    console.log(theme.success(`  ${icons.success} ${line}`));
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
                } else {
                    console.log(theme.info(`  ${icons.info} ${line}`));
                }
            }
        }

        const finalStatus = dryRun
            ? theme.info.bold(`\n[Dry Run] Generation simulation completed!`)
            : theme.success.bold(`\n${icons.check} Generation completed successfully!`);

        console.log(finalStatus);
        return;
    }