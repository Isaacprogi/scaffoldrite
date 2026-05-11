// history:async()=> {

    //   if (!fs.existsSync(HISTORY_DIR)) {
    //     console.log(chalk.red("❌ No history found."));
    //     exit(0);
    //   }

    //   const files = fs.readdirSync(HISTORY_DIR).filter(f => f.endsWith(".json"));

    //   if (files.length === 0) {
    //     console.log(chalk.yellow("⚠️  No history entries found."));
    //     exit(0);
    //   }

    //   console.log(chalk.cyanBright.bold("📜 Scaffoldrite History Entries:\n"));

    //   for (const file of files.sort()) {
    //     const fullPath = path.join(HISTORY_DIR, file);
    //     const entry: HistoryEntry = JSON.parse(fs.readFileSync(fullPath, "utf-8"));

    //     console.log(`${chalk.green("ID:")} ${chalk.whiteBright(entry.id)}`);
    //     console.log(`${chalk.green("Command:")} ${chalk.blueBright(entry.command)}`);
    //     console.log(`${chalk.green("Args:")} ${chalk.magenta(entry.args.join(" "))}`);
    //     console.log(`${chalk.green("Flags:")} ${chalk.yellow(entry.flags.join(", "))}`);
    //     console.log(`${chalk.green("Timestamp:")} ${chalk.gray(new Date(entry.timestamp).toLocaleString())}`);
    //     console.log(chalk.gray("-".repeat(40)));
    //   }

    //   console.log(chalk.cyanBright.bold(`Total entries: ${files.length}`));
    //   return;
    // }

    // },