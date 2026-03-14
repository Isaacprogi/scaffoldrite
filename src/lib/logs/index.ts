import { execSync } from "node:child_process";
const pkg = require("../../../package.json");
import path from "node:path";
import { theme,icons } from "../../data";
import { hasFlag } from "../utils";
import { exit } from "node:process";
import fs from "fs";

const cwd = process.cwd();

export function checkLatestVersion() {
    try {
        const latest = execSync("npm show scaffoldrite version").toString().trim();
        if (pkg.version !== latest) {
            console.log(theme.warning(`⚠️ A newer version of Scaffoldrite is available: v${latest}. Run 'npm install -g scaffoldrite' to upgrade.`));
        }
    } catch {}
}

export function warnLegacyConfig() {
  const legacyStructure = path.join(cwd, "structure.sr");
  const legacyIgnore = path.join(cwd, ".scaffoldignore");
  const newConfigDir = path.join(cwd, ".scaffoldrite");
  const scaffoldriteProjectConfig = path.join(newConfigDir, "scaffoldrite-project.json");
  const scaffoldriteGlobalConfig = path.join(newConfigDir, "scaffoldrite.json");


  const hasLegacy =
    fs.existsSync(legacyStructure) || fs.existsSync(legacyIgnore)
    || fs.existsSync(scaffoldriteProjectConfig) || fs.existsSync(scaffoldriteGlobalConfig);

  const hasNewConfig = fs.existsSync(newConfigDir);

  if (hasLegacy && hasNewConfig && !hasFlag('--migrate')) {
    console.log(
      theme.warning(
        `${icons.warning} Detected legacy Scaffoldrite config in project root.\n` +
        `${icons.info} Scaffoldrite v2 now uses ${theme.primary(".scaffoldrite/")}.\n\n` +
        `${icons.arrow} ${theme.accent("sr init")} to regenerate config\n` +
        `${icons.arrow} ${theme.accent("sr init --migrate")} to migrate existing files`
      )
    );
    exit(1)
  }
}