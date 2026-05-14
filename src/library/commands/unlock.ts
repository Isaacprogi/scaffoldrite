import { baseDir } from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import { hasFlag } from "../../lib/utils";
import { removeGitLock } from "../../lib/utils/gitHooks";
import { removeStructureLock } from "../../lib/utils/lock";
import { disableCI } from "../../lib/utils/lock";


interface Props {
    prePush: boolean;
}

export const unlock = async ({ prePush }: Props) => {

    if (hasFlag("--git")) {
        removeGitLock(baseDir, { prePush });
        return;
    }

    if (hasFlag("--structure")) {
        removeStructureLock();
        return;
    }

    if (hasFlag("--ci")) {
        disableCI();
        return;
    }

    console.log(theme.error(`${icons.info} Please specify a lock type:`));
    console.log(theme.muted(`  scaffoldrite unlock --git`));
    console.log(theme.muted(`  scaffoldrite unlock --structure`));
    console.log(theme.muted(`  scaffoldrite unlock --ci`));
}