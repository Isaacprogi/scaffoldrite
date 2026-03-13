import fs from "fs";
import path from "path";
import { SCAFFOLDRITE_DIR, exit } from "../../utils";
import { theme, icons } from "../../data";

const SETTINGS_FILE = path.join(SCAFFOLDRITE_DIR, "settings.json");

function readSettings(): Record<string, any> {
  if (!fs.existsSync(SETTINGS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function writeSettings(data: Record<string, any>) {
  const dir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2));
}


export function installStructureLock() {
  const settings = readSettings();

  if (settings.structureLocked === false) {
    console.log(theme.success(`${icons.lock} Structure editing locked.`));
    settings.structureLocked = true;
    writeSettings(settings);
  } else {
    console.log(theme.success(`${icons.lock} Structure editing is already locked.`));
  }
}

export function removeStructureLock() {
  const settings = readSettings();

  if (settings.structureLocked === true) {
    settings.structureLocked = false;
    writeSettings(settings);
    console.log(theme.success(`${icons.unlock} Structure editing unlocked.`));
  } else {
    console.log(theme.success(`${icons.unlock} Structure editing is already unlocked.`));
  }
}

export function isStructureLocked(): boolean {
  const settings = readSettings();
  return !!settings.structureLocked;
}

function createCIWorkflow() {
  const workflowsDir = path.join(path.dirname(SETTINGS_FILE), "..", ".github", "workflows");
  if (!fs.existsSync(workflowsDir)) fs.mkdirSync(workflowsDir, { recursive: true });

  const workflowFile = path.join(workflowsDir, "scaffoldrite.yml");

  if (fs.existsSync(workflowFile)) {
    console.log(theme.success(`✓ CI workflow already exists.`));
    return;
  }

const workflowContent = `name: Scaffoldrite Validation

on:
  push:
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install dependencies
        run: npm install

      - name: Validate using PR rules
        run: npx scaffoldrite validate

      - name: Fetch main branch rules
        run: git show origin/main:.scaffoldrite/structure.sr > structure-main.sr

      - name: Validate against main rules
        run: npx scaffoldrite validate --rules structure-main.sr
`;

  fs.writeFileSync(workflowFile, workflowContent);
  console.log(theme.success(`✓ Created .github/workflows/scaffoldrite.yml`));
}

export function enableCI() {
  const settings = readSettings();
  settings.ciEnabled = true;
  writeSettings(settings);
  console.log(theme.success(`${icons.lock} CI validation enabled.`));
  createCIWorkflow();
}

export function disableCI() {
  const settings = readSettings();
  settings.ciEnabled = false;
  writeSettings(settings);
  console.log(theme.success(`${icons.unlock} CI validation disabled.`));
}

export function isCIEnabled(): boolean {
  const settings = readSettings();
  return !!settings.ciEnabled;
}



export function isPreCommitHookEnabled(): boolean {
  const settings = readSettings();
  return !!settings.preCommitEnabled;
}


export function enablePreCommitHook() {
  const settings = readSettings();
  if (!settings.preCommitEnabled) {
    settings.preCommitEnabled = true;
    writeSettings(settings);
    console.log(theme.success(`${icons.lock} Pre-commit hook enabled.`));
  }
}

export function disablePreCommitHook() {
  const settings = readSettings();
  if (settings.preCommitEnabled) {
    settings.preCommitEnabled = false;
    writeSettings(settings);
    console.log(theme.success(`${icons.unlock} Pre-commit hook disabled.`));
  }
}

export function enablePrePushHook() {
  const settings = readSettings();
  if (!settings.prePushEnabled) {
    settings.prePushEnabled = true;
    writeSettings(settings);
     console.log(theme.success(`${icons.lock} Pre-push hook enabled.`));
  }
}

export function disablePrePushHook() {
  const settings = readSettings();
  if (settings.prePushEnabled) {
    settings.prePushEnabled = false;
    writeSettings(settings);
      console.log(theme.success(`${icons.unlock} Pre-push hook disabled.`));
  }
}

export function isPrePushHookEnabled(): boolean {
  const settings = readSettings();
  return !!settings.prePushEnabled;
}

export async function preventIfStructureLocked(commandName: string) {
  if (isStructureLocked()) {
    console.error(
      theme.error.bold(`${icons.error} Error: structure.sr is locked.`) +
      theme.warning(` Command '${commandName}' cannot modify the structure while locked.`)
    );
    exit(1);
  }
}