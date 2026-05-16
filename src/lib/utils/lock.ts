import fs from "fs";
import path from "path";
import { SCAFFOLDRITE_DIR, exit } from ".";
import { theme, icons } from "../../data";
import { getWorkflowContent } from "./ci";
import {installGitLock,removeGitLock} from './gitHooks'

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

  // Treat undefined or false as "not locked"
  if (settings.structureLocked === undefined || settings.structureLocked === false) {
    settings.structureLocked = true;
    writeSettings(settings);
    console.log(theme.success(`${icons.lock} Structure editing locked.`));
  } else {
    console.log(theme.success(`${icons.lock} Structure editing is already locked.`));
  }
}

export function removeStructureLock() {
  const settings = readSettings();

  // Treat undefined or true as "locked"
  if (settings.structureLocked === undefined || settings.structureLocked === true) {
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

async function createCIWorkflow(options?: { ref?: string; onlyAgainst?: boolean; hasAgainst?: boolean }) {
  const workflowsDir = path.join(path.dirname(SETTINGS_FILE), "..", ".github", "workflows");
  if (!fs.existsSync(workflowsDir)) fs.mkdirSync(workflowsDir, { recursive: true });

  const workflowFile = path.join(workflowsDir, "scaffoldrite.yml");

  if (fs.existsSync(workflowFile)) {
    console.log(theme.info(`ℹ Workflow file already exists at .github/workflows/scaffoldrite.yml, skipping creation.`));
    return;
  }

  fs.writeFileSync(workflowFile, getWorkflowContent(options));
  console.log(theme.success(`✓ Created .github/workflows/scaffoldrite.yml (${icons.lock} enabled).`));
}

export function enableCI(options?: { ref?: string; onlyAgainst?: boolean, hasAgainst?: boolean }) {
  const settings = readSettings();
  settings.ciEnabled = true;
  writeSettings(settings);
  createCIWorkflow(options);
}

async function removeCIWorkflow() {
  const workflowsDir = path.join(path.dirname(SETTINGS_FILE), "..", ".github", "workflows");
  const workflowFile = path.join(workflowsDir, "scaffoldrite.yml");

  if (fs.existsSync(workflowFile)) {
    fs.unlinkSync(workflowFile);
    console.log(theme.success(`✓ Removed .github/workflows/scaffoldrite.yml (${icons.unlock} disabled).`));
  } else {
    console.log(theme.info(`ℹ No workflow file found at .github/workflows/scaffoldrite.yml (Already disabled).`));
  }
}

export function disableCI() {
  const settings = readSettings();
  settings.ciEnabled = false;
  writeSettings(settings);
  removeCIWorkflow()
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
  }
}

export function disablePreCommitHook() {
  const settings = readSettings();
  if (settings.preCommitEnabled) {
    settings.preCommitEnabled = false;
    writeSettings(settings);
  }
}

export function enablePrePushHook() {
  const settings = readSettings();
  if (!settings.prePushEnabled) {
    settings.prePushEnabled = true;
    writeSettings(settings);
  }
}

export function disablePrePushHook() {
  const settings = readSettings();
  if (settings.prePushEnabled) {
    settings.prePushEnabled = false;
    writeSettings(settings);
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


export async function applyConfigSettings(baseDir: string, options?: { ref?: string; onlyAgainst?: boolean, hasAgainst?: boolean }) {
  console.log(theme.info("Applying configuration settings..."));

  // Read settings.json - this is the source of truth
  let settings = readSettings();
  
  // If no settings file exists, create default settings
  const settingsExist = Object.keys(settings).length > 0;
  if (!settingsExist) {
    const DEFAULT_SETTINGS = {
      ciEnabled: true,
      preCommitEnabled: true,
      prePushEnabled: false,
      structureLocked: false
    };
    settings = DEFAULT_SETTINGS;
    writeSettings(settings);
    console.log(theme.success(`${icons.success} Created default settings.json`));
  }

  // Apply CI based on settings.json
  if (settings.ciEnabled === true) {
    // Only enable if not already enabled
    if (!isCIEnabled()) {
      enableCI(options);
    } else {
      console.log(theme.info(`ℹ CI is already enabled`));
    }
  } else if (settings.ciEnabled === false) {
    // Remove CI completely if disabled
    if (isCIEnabled()) {
      disableCI();
    } else {
      console.log(theme.info(`ℹ CI is already disabled`));
    }
  }

  // Apply pre-commit hook based on settings.json
  if (settings.preCommitEnabled === true) {
    // Only install if not already installed
    if (!isPreCommitHookEnabled()) {
      installGitLock(baseDir, { prePush: false });
      // Update the setting to reflect it's enabled
      const currentSettings = readSettings();
      if (!currentSettings.preCommitEnabled) {
        currentSettings.preCommitEnabled = true;
        writeSettings(currentSettings);
      }
    } else {
      console.log(theme.info(`ℹ Pre-commit hook is already enabled`));
    }
  } else if (settings.preCommitEnabled === false) {
    // Remove pre-commit hook completely if disabled
    if (isPreCommitHookEnabled()) {
      removeGitLock(baseDir, { prePush: false });
      // Update the setting to reflect it's disabled
      const currentSettings = readSettings();
      if (currentSettings.preCommitEnabled) {
        currentSettings.preCommitEnabled = false;
        writeSettings(currentSettings);
      }
    } else {
      console.log(theme.info(`ℹ Pre-commit hook is already disabled`));
    }
  }

  // Apply pre-push hook based on settings.json
  if (settings.prePushEnabled === true) {
    // Only install if not already installed
    if (!isPrePushHookEnabled()) {
      installGitLock(baseDir, { prePush: true });
      // Update the setting to reflect it's enabled
      const currentSettings = readSettings();
      if (!currentSettings.prePushEnabled) {
        currentSettings.prePushEnabled = true;
        writeSettings(currentSettings);
      }
    } else {
      console.log(theme.info(`ℹ Pre-push hook is already enabled`));
    }
  } else if (settings.prePushEnabled === false) {
    // Remove pre-push hook completely if disabled
    if (isPrePushHookEnabled()) {
      removeGitLock(baseDir, { prePush: true });
      // Update the setting to reflect it's disabled
      const currentSettings = readSettings();
      if (currentSettings.prePushEnabled) {
        currentSettings.prePushEnabled = false;
        writeSettings(currentSettings);
      }
    } else {
      console.log(theme.info(`ℹ Pre-push hook is already disabled`));
    }
  }

  // Apply structure lock based on settings.json
  if (settings.structureLocked === true) {
    // Only lock if not already locked
    if (!isStructureLocked()) {
      const currentSettings = readSettings();
      if (!currentSettings.structureLocked) {
        currentSettings.structureLocked = true;
        writeSettings(currentSettings);
      }
      console.log(theme.success(`${icons.lock} Structure editing locked.`));
    } else {
      console.log(theme.info(`ℹ Structure editing is already locked`));
    }
  } else if (settings.structureLocked === false) {
    // Unlock structure completely if disabled
    if (isStructureLocked()) {
      const currentSettings = readSettings();
      if (currentSettings.structureLocked) {
        currentSettings.structureLocked = false;
        writeSettings(currentSettings);
      }
      console.log(theme.success(`${icons.unlock} Structure editing unlocked.`));
    } else {
      console.log(theme.info(`ℹ Structure editing is already unlocked`));
    }
  }

  console.log(theme.success(`${icons.success} All settings applied according to settings.json`));
}