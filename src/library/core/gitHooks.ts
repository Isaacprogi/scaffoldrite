import fs from "fs";
import path from "path";
import {
  enablePreCommitHook,
  disablePreCommitHook,
  enablePrePushHook,
  disablePrePushHook,
  isPreCommitHookEnabled,
  isPrePushHookEnabled
} from "./lock";
import { icons, theme } from "../../data";

const START_MARKER = "# >>> scaffoldrite-structure-lock >>>";
const END_MARKER = "# <<< scaffoldrite-structure-lock <<<";

function ensureGitRepo(baseDir: string) {
  if (!fs.existsSync(path.join(baseDir, ".git"))) {
    throw new Error(
      theme.error(`${icons.error} Not inside a Git repository.`)
    );
  }
}


function getHookPath(baseDir: string, hookName: string): { path: string; type: "husky" | "git" } {
  const huskyDir = path.join(baseDir, ".husky");
  const huskyHookPath = path.join(huskyDir, hookName);
  const gitHookPath = path.join(baseDir, ".git", "hooks", hookName);
  
  const hasHusky = fs.existsSync(huskyDir);
  
  if (hasHusky) {
    const isHuskyV8 = fs.existsSync(path.join(huskyDir, hookName, hookName));
    
    if (isHuskyV8) {
      return { path: path.join(huskyDir, hookName, hookName), type: "husky" };
    }
    
    return { path: huskyHookPath, type: "husky" };
  }
  
  return { path: gitHookPath, type: "git" };
}

function buildHookSnippet(): string {
  return `
${START_MARKER}
# Scaffoldrite structure validation
scaffoldrite validate
if [ $? -ne 0 ]; then
  echo "${theme.error(`${icons.cross} Scaffoldrite structure validation failed.`)}"
  exit 1
fi
${END_MARKER}
`;
}


export function installGitLock(baseDir: string, options?: { prePush?: boolean }) {
  ensureGitRepo(baseDir);

  const hookName = options?.prePush ? "pre-push" : "pre-commit";

  // Update settings
  if (options?.prePush) {
    enablePrePushHook();
  } else {
    enablePreCommitHook();
  }

  // Install hook snippet
  const hookInfo = getHookPath(baseDir, hookName);
  const snippet = buildHookSnippet();

  let existingContent = "";
  if (fs.existsSync(hookInfo.path)) {
    existingContent = fs.readFileSync(hookInfo.path, "utf-8");
    if (existingContent.includes(START_MARKER)) {
      console.log(
        theme.accent(`${icons.lock} Scaffoldrite already installed in ${hookName} (${hookInfo.type} hook).`)
      );
      return;
    }
  } else {
    existingContent = "#!/bin/sh\n";
  }

  const newContent = existingContent.trimEnd() + "\n" + snippet;
  fs.writeFileSync(hookInfo.path, newContent, { mode: 0o755 });

  console.log(
    theme.success(`${icons.lock} Scaffoldrite installed in ${hookName} (${hookInfo.type} hook).`)
  );
}


export function removeGitLock(baseDir: string, options?: { prePush?: boolean }) {
  ensureGitRepo(baseDir);

  const hookName = options?.prePush ? "pre-push" : "pre-commit";

  if (options?.prePush) {
    disablePrePushHook();
  } else {
    disablePreCommitHook();
  }

  const hookInfo = getHookPath(baseDir, hookName);
  if (!fs.existsSync(hookInfo.path)) {
    console.log(
      theme.warning(`${icons.warning} No ${hookName} hook found.`)
    );
    return;
  }

  const content = fs.readFileSync(hookInfo.path, "utf-8");
  if (!content.includes(START_MARKER)) {
    console.log(
      theme.warning(`${icons.warning} Scaffoldrite hook not found.`)
    );
    return;
  }

  const cleaned = content
    .replace(new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}\\n?`, "g"), "")
    .trim();

  if (cleaned === "" || cleaned === "#!/bin/sh") {
    fs.unlinkSync(hookInfo.path);
    console.log(
      theme.accent(`${icons.unlock} ${hookName} removed completely (${hookInfo.type} hook).`)
    );
  } else {
    fs.writeFileSync(hookInfo.path, cleaned, { mode: 0o755 });
    console.log(
      theme.accent(`${icons.unlock} Scaffoldrite removed from ${hookName} (${hookInfo.type} hook).`)
    );
  }
}


export function isGitLockInstalled(
  baseDir: string,
  hookName: "pre-commit" | "pre-push"
): boolean {
  // Check settings first
  if (hookName === "pre-commit") return isPreCommitHookEnabled();
  if (hookName === "pre-push") return isPrePushHookEnabled();

  return false;
}