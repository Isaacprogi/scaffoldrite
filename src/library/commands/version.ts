import { theme } from "../../data";
import { exit } from "../../lib/utils";
const pkg = require("../../../package.json");

export const version = () => {
    console.log(
        theme.primary.bold('Scaffoldrite') +
        theme.muted(' v') +
        theme.light.bold(pkg.version)
    );
    console.log(theme.info(`ℹ️ Run \`scaffoldrite changelog\` to see what’s new in this version.`));
    exit(0);
}
