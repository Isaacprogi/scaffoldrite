import { validateConstraints } from "../validator";
import { baseDir, loadAST} from "../../lib/utils";
import { theme } from "../../data";
import { icons } from "../../data";
import path from "path";
import { exit } from "../../lib/utils";
import { getIgnoreList } from "../../lib/utils";
import { loadASTFromRef } from "../../lib/utils";
import { validateFS } from "../validateFS";

interface Props {
    againstValue: string;
    hasAgainst: boolean;
    allowExtra:boolean;
    allowExtraPaths:string[];
}


export const validate = async ({againstValue,hasAgainst,allowExtra,allowExtraPaths}:Props) => {
        let structure;

        if (hasAgainst) {
            structure = loadASTFromRef(againstValue);
            console.log(theme.info(`${icons.info} Validating against ${againstValue}`));
        } else {
            structure = loadAST();
        }

        const outputDir = path.resolve(baseDir);
        const ignoreList = getIgnoreList();

        try {
            validateConstraints(structure.root, structure.constraints);
            validateFS(structure.root, outputDir, {
                ignoreList,
                allowExtra,
                allowExtraPaths,
            });
            console.log(
                theme.success.bold(`${icons.success} All constraints and filesystem structure are valid`)
            );
        } catch (err: any) {
            console.error(
                theme.error.bold(`${icons.error} Validation failed: `) +
                theme.light(err.message)
            );
            exit(1);
        }
    }