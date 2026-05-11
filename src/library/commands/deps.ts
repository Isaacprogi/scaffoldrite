import { theme } from "../../data";
import { baseDir} from "../../lib/utils";
import path from "path";
import { getIgnoreList } from "../../lib/utils";
import { loadAST } from "../../lib/utils";
import { buildDependencyGraph,buildGraphFromStructure,printCircular,printDependencyTree } from "../core/deps";
import { startServer } from "../core/graph-server";
import { detectCircular } from "../core/deps";
import { findStandaloneFiles } from "../core/deps";

interface Props {
    isFS: boolean,
    showStandalone:boolean;
    serve:boolean;
    showCircular:boolean;
}


export const deps = async ({isFS,showStandalone,showCircular,serve}:Props) => {
        const targetDir = path.resolve(baseDir);
        const ignoreList = getIgnoreList();

        const structure = loadAST();

        let graph;

        if (isFS) {
            graph = buildDependencyGraph(targetDir, ignoreList);
        } else {
            graph = await buildGraphFromStructure(
                targetDir,
                structure.root
            );
        }

        console.log(graph);

        const circular = detectCircular(graph);
        const standalone = findStandaloneFiles(graph);

        if (showCircular) {
            if (circular.length > 0) {
                console.log(theme.error.bold(`\nCircular Dependencies`));
                printCircular(graph);
            }
            return;
        }

        if (showStandalone) {
            if (standalone.length > 0) {
                console.log(theme.warning.bold(`\nStandalone Files`));
                standalone.forEach((f) =>
                    console.log(theme.light(`- ${f}`))
                );
            }
            return;
        }

        console.log(theme.primary.bold(`\nFile Dependency Tree\n`));

        printDependencyTree(graph);

        if (standalone.length > 0) {
            console.log(theme.warning.bold(`\nStandalone Files`));

            standalone.forEach((f) =>
                console.log(theme.light(`- ${f}`))
            );
        }

        if (circular.length > 0) {
            console.log(theme.error.bold(`\nCircular Dependencies`));

            printCircular(graph);
        }

        if (serve) {
            startServer(graph, circular, standalone);
        }
    }