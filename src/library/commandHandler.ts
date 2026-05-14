import fs from "fs";
import { parseStructure } from "./parser";
import { createProgressBar } from "./progress";

import {
    DEFAULT_TEMPLATE,
    icons,
    theme,
} from "../data/index";

import {
    hasFlag,
    getPassedFlags,
    getFlagValuesAfter,
    ALLOWED_FLAGS,
    ALLOWED_COMMANDS,
    printUsage,
    runRequirements,
    checkMutuallyExclusiveFlags,
    SCAFFOLDRITE_DIR,
    STRUCTURE_PATH,
    baseDir,
    exit,
    command,
} from "../lib/utils/index";

import type {
    CommandHandler,
    HistoryEntry,
} from "../types/index";


// Commands
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
import { doctorCommand } from "./commands/doctor";



// ARGS

const args = process.argv
    .slice(3)
    .filter((a) => !a.startsWith("--"));

const arg3 = args[0];
const arg4 = args[1];



// FLAGS

const passedFlags = getPassedFlags();
const allowedFlags = ALLOWED_FLAGS[command];

const dryRun = hasFlag("--dry-run");
const verbose = hasFlag("--verbose");
const summary = hasFlag("--summary");

const force = hasFlag("--force");
const empty = hasFlag("--empty");
const migrate = hasFlag("--migrate");
const fromFs = hasFlag("--from-fs");

const prePush = hasFlag("--pre-push");
const onlyAgainst = hasFlag("--only");

const ifNotExists = hasFlag("--if-not-exists");

const ignoreTooling = hasFlag("--ignore-tooling");
const copyContents = hasFlag("--copy");

const isFS = hasFlag("--fs");
const isStructure = hasFlag("--structure") || hasFlag("--sr");
const isDiff = hasFlag("--diff");

const withIcons = hasFlag("--with-icon");

const showCircular = hasFlag("--circular");
const showStandalone = hasFlag("--standalone");
const serve = hasFlag("--serve");

const isLocalAst = hasFlag("--local-ast");

const hasAgainst = hasFlag("--against");
const againstValue =
    getFlagValuesAfter("--against")[0] || "origin/main";

const allowExtraPaths = getFlagValuesAfter("--allow-extra");
const allowExtra =
    hasFlag("--allow-extra") &&
    allowExtraPaths.length === 0;



// SHARED

const parsed = parseStructure(DEFAULT_TEMPLATE);

const bar = createProgressBar();



// INIT CHECK
const requiresInit = [
    "update",
    "merge",
    "validate",
    "generate",
    "create",
    "delete",
    "rename",
    "list",
];


if (requiresInit.includes(command)) {
    const isInitialized =
        fs.existsSync(SCAFFOLDRITE_DIR) &&
        fs.existsSync(STRUCTURE_PATH);

    if (!isInitialized) {
        console.error(
            theme.error.bold(
                `${icons.error} Error: Scaffoldrite is not initialized.\n`
            ) +
            theme.primary(
                `Please run:\n  scaffoldrite init [dir]`
            )
        );

        printUsage("init");
        exit(1);
    }
}


// COMMAND VALIDATION

if (!command || command === "--help" || command === "-h") {
    printUsage();
    exit(0);
}

if (!ALLOWED_COMMANDS.includes(command)) {
    console.error(
        theme.error.bold(
            `${icons.error} Unknown command: ${command}`
        )
    );

    printUsage();
    exit(1);
}

if (!ALLOWED_FLAGS.hasOwnProperty(command)) {
    console.log(
        allowedFlags !== undefined
            ? allowedFlags
            : ""
    );

    printUsage();
    exit(1);
}

const invalidFlags = passedFlags?.filter(
    (flag) => !allowedFlags.includes(flag)
);

if (invalidFlags?.length > 0) {
    console.error(
        theme.error.bold(
            `${icons.error} Unknown flag(s) for '${command}': `
        ) +
        theme.warning(invalidFlags.join(", "))
    );

    printUsage(command);
    exit(1);
}



// RULE CHECKS

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
    serve,
    standalone: showStandalone,
    circular: showCircular,
});

runRequirements({
    command,
    arg3,
    arg4,
    fromFs,
    printUsage,
});


// CLI CONTEXT

export interface CLIContext {
    command: string;

    arg3: string;
    arg4: string;

    dryRun: boolean;
    verbose: boolean;
    summary: boolean;

    force: boolean;
    empty: boolean;
    migrate: boolean;
    fromFs: boolean;

    prePush: boolean;
    onlyAgainst: boolean;

    ifNotExists: boolean;

    ignoreTooling: boolean;
    copyContents: boolean;

    isFS: boolean;
    isStructure: boolean;
    isDiff: boolean;

    withIcons: boolean;

    showCircular: boolean;
    showStandalone: boolean;
    serve: boolean;

    isLocalAst: boolean;

    hasAgainst: boolean;
    againstValue: string;

    allowExtra: boolean;
    allowExtraPaths: string[];

    parsed: ReturnType<typeof parseStructure>;

    bar: ReturnType<typeof createProgressBar>;

    baseDir: string;
}



export const ctx: CLIContext = {
    command,

    arg3,
    arg4,

    dryRun,
    verbose,
    summary,

    force,
    empty,
    migrate,
    fromFs,

    prePush,
    onlyAgainst,

    ifNotExists,

    ignoreTooling,
    copyContents,

    isFS,
    isStructure,
    isDiff,

    withIcons,

    showCircular,
    showStandalone,
    serve,

    isLocalAst,

    hasAgainst,
    againstValue,

    allowExtra,
    allowExtraPaths,

    parsed,

    bar,

    baseDir,
};



// COMMAND HANDLERS

export const commandHandlers: Record<
    string,
    CommandHandler
> = {
    version: () => version(),

    init: () =>
        init({
            force: ctx.force,
            fromFs: ctx.fromFs,
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
            parsed: ctx.parsed,
            migrate: ctx.migrate,
            empty: ctx.empty,
        }),

    create: () =>
        create({
            force: ctx.force,
            ifNotExists: ctx.ifNotExists,
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
            summary: ctx.summary,
            verbose: ctx.verbose,
            arg4: ctx.arg4,
        }),

    delete: () =>
        del({
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
            verbose: ctx.verbose,
            summary: ctx.summary,
        }),

    rename: () =>
        rename({
            force: ctx.force,
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
            summary: ctx.summary,
            verbose: ctx.verbose,
            arg4: ctx.arg4,
        }),

    update: () =>
        update({
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
        }),

    find: () =>find({
            arg3: ctx.arg3,
            isFS: ctx.isFS,
            isStructure: ctx.isStructure,
            hasAgainst: ctx.hasAgainst,
            againstValue: ctx.againstValue,}),

    merge: () => merge({
            arg3: ctx.arg3,
            dryRun: ctx.dryRun,
        }),

    list: () => list({
            isFS: ctx.isFS,
            isDiff: ctx.isDiff,
            isStructure: ctx.isStructure,
            withIcons: ctx.withIcons,
            againstValue: ctx.againstValue,
            hasAgainst: ctx.hasAgainst,
        }),

    deps: () => deps({
            isFS: ctx.isFS,
            showCircular: ctx.showCircular,
            showStandalone: ctx.showStandalone,
            serve: ctx.serve,
        }),

    generate: () => generate({
            arg3: ctx.arg3,
            againstValue: ctx.againstValue,
            isLocalAst: ctx.isLocalAst,
            dryRun: ctx.dryRun,
            ignoreTooling: ctx.ignoreTooling,
            copyContents: ctx.copyContents,
            verbose: ctx.verbose,
            summary: ctx.summary,
            bar: ctx.bar,
            hasAgainst: ctx.hasAgainst,
        }),

    lock: () => lock({
            againstValue: ctx.againstValue,
            onlyAgainst: ctx.onlyAgainst,
            prePush: ctx.prePush,
            hasAgainst: ctx.hasAgainst,
        }),

    unlock: () =>
        unlock({
            prePush: ctx.prePush,
        }),

    validate: () =>
        validate({
            againstValue: ctx.againstValue,
            hasAgainst: ctx.hasAgainst,
            allowExtra: ctx.allowExtra,
            allowExtraPaths: ctx.allowExtraPaths,
        }),

    doctor: () => doctorCommand(ctx.baseDir),
};