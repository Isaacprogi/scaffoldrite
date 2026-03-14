#!/usr/bin/env node


import { main } from "./library/main";
import { commandHandlers } from "./library/commandHandler";
import { command } from "./lib/utils";
import { checkLatestVersion } from "./lib/logs";
import { warnLegacyConfig } from "./lib/logs";


checkLatestVersion();
warnLegacyConfig();

main(command, commandHandlers);
