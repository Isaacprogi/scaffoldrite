// @ts-nocheck
import * as __fd_glob_26 from "../content/docs/commands/commands/validate.md?collection=docs"
import * as __fd_glob_25 from "../content/docs/commands/commands/update.md?collection=docs"
import * as __fd_glob_24 from "../content/docs/commands/commands/rename.md?collection=docs"
import * as __fd_glob_23 from "../content/docs/commands/commands/merge.md?collection=docs"
import * as __fd_glob_22 from "../content/docs/commands/commands/list.md?collection=docs"
import * as __fd_glob_21 from "../content/docs/commands/commands/init.md?collection=docs"
import * as __fd_glob_20 from "../content/docs/commands/commands/generate.md?collection=docs"
import * as __fd_glob_19 from "../content/docs/commands/commands/find.md?collection=docs"
import * as __fd_glob_18 from "../content/docs/commands/commands/delete.md?collection=docs"
import * as __fd_glob_17 from "../content/docs/commands/commands/create.md?collection=docs"
import * as __fd_glob_16 from "../content/docs/release/v3.md?collection=docs"
import * as __fd_glob_15 from "../content/docs/commands/positional-arguments.md?collection=docs"
import * as __fd_glob_14 from "../content/docs/commands/index.md?collection=docs"
import * as __fd_glob_13 from "../content/docs/commands/flags-reference.md?collection=docs"
import * as __fd_glob_12 from "../content/docs/commands/command-reference.md?collection=docs"
import * as __fd_glob_11 from "../content/docs/structure-language.md?collection=docs"
import * as __fd_glob_10 from "../content/docs/real-world-workflows.md?collection=docs"
import * as __fd_glob_9 from "../content/docs/project-configuration.md?collection=docs"
import * as __fd_glob_8 from "../content/docs/index.md?collection=docs"
import * as __fd_glob_7 from "../content/docs/ignoring-files.md?collection=docs"
import * as __fd_glob_6 from "../content/docs/getting-started.md?collection=docs"
import * as __fd_glob_5 from "../content/docs/filesystem-content-handling.md?collection=docs"
import * as __fd_glob_4 from "../content/docs/faqs.md?collection=docs"
import * as __fd_glob_3 from "../content/docs/daily-workflows.md?collection=docs"
import * as __fd_glob_2 from "../content/docs/constraints.md?collection=docs"
import * as __fd_glob_1 from "../content/docs/community-license.md?collection=docs"
import * as __fd_glob_0 from "../content/docs/advanced-scenarios.md?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {}, {"advanced-scenarios.md": __fd_glob_0, "community-license.md": __fd_glob_1, "constraints.md": __fd_glob_2, "daily-workflows.md": __fd_glob_3, "faqs.md": __fd_glob_4, "filesystem-content-handling.md": __fd_glob_5, "getting-started.md": __fd_glob_6, "ignoring-files.md": __fd_glob_7, "index.md": __fd_glob_8, "project-configuration.md": __fd_glob_9, "real-world-workflows.md": __fd_glob_10, "structure-language.md": __fd_glob_11, "commands/command-reference.md": __fd_glob_12, "commands/flags-reference.md": __fd_glob_13, "commands/index.md": __fd_glob_14, "commands/positional-arguments.md": __fd_glob_15, "release/v3.md": __fd_glob_16, "commands/commands/create.md": __fd_glob_17, "commands/commands/delete.md": __fd_glob_18, "commands/commands/find.md": __fd_glob_19, "commands/commands/generate.md": __fd_glob_20, "commands/commands/init.md": __fd_glob_21, "commands/commands/list.md": __fd_glob_22, "commands/commands/merge.md": __fd_glob_23, "commands/commands/rename.md": __fd_glob_24, "commands/commands/update.md": __fd_glob_25, "commands/commands/validate.md": __fd_glob_26, });