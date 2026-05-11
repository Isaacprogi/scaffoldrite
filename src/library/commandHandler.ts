
import fs from "fs";
import { parseStructure } from "./parser";
import { DEFAULT_TEMPLATE, DEFAULT_IGNORE_TEMPLATE } from '../data/index'
import { ALLOWED_COMMANDS } from "../lib/utils/index";
import { createProgressBar } from "./progress";
// import { Operation } from "../types/index";
import {
    hasFlag, getPassedFlags, getFlagValuesAfter, ALLOWED_FLAGS, printUsage
} from "../lib/utils/index";
import { HistoryEntry } from "../types/index";
// import { structureToSRString } from "./utils/index";
// import { v4 as uuidv4 } from "uuid";
// import chalk from "chalk";
import { icons, theme } from "../data/index";
import { runRequirements, checkMutuallyExclusiveFlags } from "../lib/utils/index";
import { SCAFFOLDRITE_DIR, STRUCTURE_PATH } from "../lib/utils/index";
import { baseDir } from "../lib/utils/index";
import { exit } from "../lib/utils/index";
import { CommandHandler } from "../types/index";
import { command } from "../lib/utils/index";
import { doctorCommand } from "./commands/doctor";

//commands
import { init } from "./commands/init";
import { update } from "./commands/update";
import { list } from "./commands/list";
import { deps } from "./commands/deps";
import { version } from "./commands/version";
import { lock } from "./commands/lock";
import { unlock } from "./commands/unlock";
import { validate } from "./commands/validate";
import { find } from "./commands/find";
import { merge } from "./commands/merge";
import { generate } from "./commands/generate";
import { create } from "./commands/create";
import { rename } from "./commands/rename";
import { del } from "./commands/delete";


const args = process.argv.slice(3).filter((a) => !a.startsWith("--"));
const arg3 = args[0];
const arg4 = args[1];


const passedFlags = getPassedFlags();
const allowedFlags = ALLOWED_FLAGS[command];
const dryRun = hasFlag("--dry-run");
const bar = createProgressBar();
const verbose = hasFlag("--verbose");
const summary = hasFlag("--summary");
const prePush = hasFlag("--pre-push")

const ignoreTooling = hasFlag("--ignore-tooling");

const requiresInit = ["update", "merge", "validate", "generate", "create", "delete", "rename", "list"];
if (requiresInit.includes(command)) {
    if (!fs.existsSync(SCAFFOLDRITE_DIR) || !fs.existsSync(STRUCTURE_PATH)) {
        console.error(
            theme.error.bold(`${icons.error} Error: Scaffoldrite is not initialized.\n`) +
            theme.primary(`Please run:\n  scaffoldrite init [dir]`)
        );
        printUsage("init");
        exit(1);
    }
}

const isStructure = hasFlag("--structure") || hasFlag("--sr");
const isFS = hasFlag("--fs");
const isDiff = hasFlag("--diff");
const withIcons = hasFlag('--with-icon')


const empty = hasFlag("--empty");
const fromFs = hasFlag("--from-fs");

const force = hasFlag("--force");
const ifNotExists = hasFlag("--if-not-exists");

const allowExtraPaths = getFlagValuesAfter("--allow-extra");
const allowExtra = hasFlag("--allow-extra") && allowExtraPaths.length === 0;
const migrate = hasFlag("--migrate");
const isLocalAst = hasFlag("--local-ast");

const parsed = parseStructure(DEFAULT_TEMPLATE);

const copyContents = hasFlag("--copy");


const showCircular = hasFlag("--circular");
const showStandalone = hasFlag("--standalone");
const serve = hasFlag("--serve");
const onlyAgainst = hasFlag("--only");

const hasAgainst = hasFlag("--against");
const againstValue = getFlagValuesAfter("--against")[0] || "origin/main";


if (!command || command === "--help" || command === "-h") {
    printUsage();
    exit(0);
}


if (!ALLOWED_COMMANDS.includes(command)) {
    console.error(theme.error.bold(`${icons.error} Unknown command: ${command}`));
    printUsage();
    process.exit(1);
}

if (!ALLOWED_FLAGS.hasOwnProperty(command)) {
    console.log(allowedFlags !== undefined ? allowedFlags : "");
    printUsage();
    process.exit(1);
}

const invalidFlags = passedFlags?.filter(
    (flag) => !allowedFlags.includes(flag)
);


if (invalidFlags?.length > 0) {
    console.error(
        theme.error.bold(`${icons.error} Unknown flag(s) for '${command}': `) +
        theme.warning(invalidFlags.join(", "))
    );
    printUsage(command);
    exit(1);
}


checkMutuallyExclusiveFlags({
    command,
    summary,
    verbose,
    empty,
    fromFs,
    ignoreTooling,
    copyContents,
    isFS,
    isStructure,
    isDiff,
    theme,
    icons,
});

runRequirements({
    command,
    arg3,
    arg4,
    fromFs,
    printUsage,
});


export const commandHandlers: Record<string, CommandHandler> = {
    version:  () => version(),
    init:     () => init({ force, fromFs, arg3, dryRun, parsed, migrate, empty }),
    create:   () => create({ force, ifNotExists, arg3, dryRun, summary, verbose, arg4 }),
    delete:   () => del({ arg3, dryRun, verbose, summary }),
    rename:   () => rename({ force, arg3, dryRun, summary, verbose, arg4 }),
    update:   () => update({ arg3, dryRun }),
    find:     () => find({ arg3, isFS, isStructure, hasAgainst, againstValue }),
    merge:    () => merge({ arg3, dryRun }),
    list:     () => list({ isFS, isDiff, isStructure, withIcons, againstValue, hasAgainst }),
    deps:     () => deps({ isFS, showCircular, showStandalone, serve }),
    generate: () => generate({ arg3, againstValue, isLocalAst, dryRun, ignoreTooling, copyContents, verbose, summary, bar, hasAgainst }),
    lock:     () => lock({ againstValue, onlyAgainst, prePush, hasAgainst }),
    unlock:   () => unlock({ prePush }),
    validate: () => validate({ againstValue, hasAgainst, allowExtra, allowExtraPaths }),
    doctor:   () => doctorCommand(baseDir),
};
