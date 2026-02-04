import { execSync } from "child_process";
import { theme, icons } from "../../data";
import path from "path";
import fs from "fs";
import { generateStructure } from "./generateStructure";

// ─────────────────────────────────────────────
// HELPER: readline wrapper
// ─────────────────────────────────────────────
function createAsk() {
  const rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q: string) =>
    new Promise<string>((res) => rl.question(q, res));

  return { ask, close: () => rl.close() };
}

// ─────────────────────────────────────────────
// HELPER: sanitize AI output for ScaffoldRite
// ─────────────────────────────────────────────
function sanitizeStructureSR(input: string): string {
  return input
    .split("\n")
    .filter((line) => !line.match(/^\s*(STRUCTURE|FORMAT|SYNTAX|RULES)/i))
    .join("\n")
    .trim();
}

// ─────────────────────────────────────────────
// MAIN AI FUNCTION
// ─────────────────────────────────────────────
export const ai = async () => {
  try {
    // ─────────────────────────────────────────────
    // 1️⃣ INITIAL QUESTIONS
    // ─────────────────────────────────────────────
    let { ask, close } = createAsk();

    const projectName = await ask("Project name: ");
    const framework = await ask("Framework (react, vue, vanilla): ");
    const language = await ask("Language (js, ts): ");

    close(); // ❗ CLOSE BEFORE execSync

    // ─────────────────────────────────────────────
    // 2️⃣ CREATE VITE PROJECT
    // ─────────────────────────────────────────────
    let template = framework.toLowerCase();
    if (framework === "react" && language === "ts") template = "react-ts";
    if (framework === "vue" && language === "ts") template = "vue-ts";
    if (framework === "vanilla" && language === "ts") template = "vanilla-ts";

    execSync(
      `npx create-vite@latest "${projectName}" --template ${template} --no-rolldown --no-immediate`,
      {
        stdio: "inherit",
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
      }
    );

    const projectPath = path.resolve(process.cwd(), projectName);

    // ─────────────────────────────────────────────
    // 3️⃣ INIT SCAFFOLDRITE
    // ─────────────────────────────────────────────
    execSync("sr init --from-fs .", {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });

    // ─────────────────────────────────────────────
    // 4️⃣ ASK FOR AI ASSISTANCE
    // ─────────────────────────────────────────────
    ({ ask, close } = createAsk());

    const wantAI = await ask(
      "\n🤖 Do you want AI assistance in scaffolding the structure of your app? (yes/no): "
    );

    if (wantAI.toLowerCase() === "yes") {
      while (true) {
        const description = await ask(
          "\n📝 Describe your project or what you want to add/change:\n"
        );

        const structurePath = path.join(
          projectPath,
          ".scaffoldrite",
          "structure.sr"
        );
        const existingStructure = fs.readFileSync(structurePath, "utf-8");

        const result = await generateStructure({
          existingStructure,
          description,
        });

        // 🧠 CLARIFICATION MODE
        if (result.startsWith("CLARIFICATION_REQUIRED")) {
          console.log("\n🤖 I need clarification:\n");
          console.log(result);

          const confirm = await ask("\nIs this what you meant? (yes/no): ");

          if (confirm.toLowerCase() === "yes") {
            await ask("\n✏️ Please rephrase clearly what you want:\n");
            continue;
          } else {
            console.log("\n🔁 Okay, please describe what you want again.\n");
            continue;
          }
        }

        // ✅ STRUCTURE MODE
        const clean = sanitizeStructureSR(result);
        fs.writeFileSync(structurePath, clean);

        // SAFETY STEP — NON-NEGOTIABLE
        execSync("sr merge --from-fs .", {
          cwd: projectPath,
          stdio: "inherit",
        });

        // NOW it's safe
        execSync("sr generate .", {
          cwd: projectPath,
          stdio: "inherit",
        });

        execSync("sr list --sr --with-icon", {
          cwd: projectPath,
          stdio: "inherit",
        });

        // Ask if satisfied
        ({ ask, close } = createAsk());
        const satisfied = await ask(
          "\n✅ Are you satisfied with the structure? (yes/no): "
        );

        if (satisfied.toLowerCase() === "yes") break;
      }
    }

    close();

    // ─────────────────────────────────────────────
    // 5️⃣ FINISH
    // ─────────────────────────────────────────────
    console.log(theme.success(`\n🎉 Project ${projectName} is ready!\n`));
    console.log(theme.muted(`  cd ${projectName}`));
    console.log(theme.muted("  npm install"));
    console.log(theme.muted("  npm run dev"));
  } catch (err) {
    console.error(theme.error(`❌ Failed: ${(err as Error).message}`));
  }
};
