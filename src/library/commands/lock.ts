import { hasFlag } from "../../lib/utils";
import { installGitLock } from "../core/gitHooks";
import { installStructureLock } from "../core/lock";
import { enableCI } from "../core/lock";
import { baseDir } from "../../lib/utils";
import { icons, theme } from "../../data";
import { applyConfigSettings } from "../core/lock";

interface Props {
    againstValue:string;
    onlyAgainst:boolean;
    hasAgainst:boolean;
    prePush:boolean;
}

   
export const  lock =  async ({againstValue,onlyAgainst,prePush,hasAgainst}:Props) => {

        if (hasFlag("--git")) {
            installGitLock(baseDir, { prePush });
            return;
        }

        if (hasFlag("--structure")) {
            installStructureLock();
            return;
        }

        if (hasFlag("--ci")) {
            enableCI({ ref: againstValue, onlyAgainst, hasAgainst });
            return;
        }
        if (hasFlag("--config")) {
            console.log(theme.warning(`${icons.warning} Warning: This may remove Scaffoldrite-related config settings. Use with caution.`));
            await applyConfigSettings(baseDir, { ref: againstValue, onlyAgainst, hasAgainst });
            return;
        }

        console.log(theme.error(`${icons.info} Please specify a lock type:`));
        console.log(theme.muted(`  scaffoldrite unlock --git`));
        console.log(theme.muted(`  scaffoldrite unlock --structure`));
        console.log(theme.muted(`  scaffoldrite unlock --ci`));
    }