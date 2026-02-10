#!/usr/bin/env ts-node
import { execSync } from "child_process";
import { theme, icons } from "../../data";
import path from "path";
import fs from "fs";

import { runWorkflow, createAdapter, AdapterConfig } from "@scaffoldrite/ai-workflow";
import readline from "readline";

// ─────────────────────────────────────────────
// 1️⃣ LLM Adapter Setup
// ─────────────────────────────────────────────
const llmAdapter = createAdapter(
  "openai",
  {
    apiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4",
    maxTokens: 1200,
    temperature: 0.2,
  } as AdapterConfig
);

// ─────────────────────────────────────────────
// 2️⃣ Helper: readline wrapper
// ─────────────────────────────────────────────
function createAsk() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = (q: string) =>
    new Promise<string>((res) => rl.question(q, res));
  return { ask, close: () => rl.close(), rl };
}

// ─────────────────────────────────────────────
// 3️⃣ Helper: sanitize AI output for ScaffoldRite
// ─────────────────────────────────────────────
function sanitizeStructureSR(input: string) {
  return input
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return (
        t === "" ||
        t === "{" ||
        t === "}" ||
        /^(folder|file|constraints)/.test(t)
      );
    })
    .join("\n")
    .trim();
}

// ─────────────────────────────────────────────
// 4️⃣ Main AI CLI Function
// ─────────────────────────────────────────────
export const ai = async () => {
  try {
    // Ask for project name
    let { ask, close, rl } = createAsk();
    const projectName = await ask("Project name: ");
    close();

    const projectPath = path.resolve(process.cwd(), projectName);

    // Initialize project from filesystem
    execSync("sr init --from-fs .", {
      cwd: projectPath,
      stdio: "inherit",
      shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
    });

    // Ask if AI assistance is wanted
    ({ ask, close, rl } = createAsk());
    const wantAI = await ask(
      "\n🤖 Do you want AI assistance in scaffolding the structure of your app? (yes/no): "
    );

    if (wantAI.toLowerCase() === "yes") {
      while (true) {
        console.log(
          "\n📝 Paste your project description below. Press ENTER on an empty line when done:\n"
        );

        const descriptionLines: string[] = [];

        await new Promise<void>((res) => {
          const onLine = (line: string) => {
            if (line.trim() === "") {
              rl.removeListener("line", onLine);
              res();
            } else {
              descriptionLines.push(line);
            }
          };
          rl.removeAllListeners("line");
          rl.on("line", onLine);
        });

        const description = descriptionLines.join(" ");

        const structurePath = path.join(
          projectPath,
          ".scaffoldrite",
          "structure.sr"
        );
        const existingStructure = fs.readFileSync(structurePath, "utf-8");

        // Run AI workflow
        const result = await runWorkflow({
          existingStructure,
          userRequest: description,
          llmAdapter,
          onProgress: (step, message) => console.log(`Step ${step}: ${message}`),
        });

        // Handle clarification if needed
        if (result.type === "clarify") {
          console.log("\n🤖 AI requires clarification:\n");
          console.log(result.message);
          console.log("Options:", result.options.join(", "));

          const confirm = await ask("\nDo you want to clarify? (yes/no): ");
          if (confirm.toLowerCase() === "yes") {
            console.log("\n✏️ Please rephrase your request clearly:\n");
            continue;
          } else {
            console.log("\n🔁 Let's try describing it again.\n");
            continue;
          }
        }

        // Handle architecture suggestions
        if (result.type === "improve") {
          console.log("\n💡 AI Suggestions for improvement:");
          result.suggestions.forEach((s, i) => console.log(`${i + 1}. ${s}`));
          continue; // allow user to adjust description
        }

        // Handle knowledge answers
        if (result.type === "answer") {
          console.log("\n📚 AI Answer:");
          console.log(result.message);
          continue; // loop back to project description
        }

        // Handle filesystem operations
        if (["create", "delete", "move", "rename"].includes(result.type)) {
          const clean = sanitizeStructureSR(JSON.stringify(result, null, 2));
          fs.writeFileSync(structurePath, clean);

          // Safety: merge and generate
          execSync("sr merge --from-fs .", {
            cwd: projectPath,
            stdio: "inherit",
          });
          execSync("sr generate .", {
            cwd: projectPath,
            stdio: "inherit",
          });
          execSync("sr list --sr --with-icon", {
            cwd: projectPath,
            stdio: "inherit",
          });
        }

        const satisfied = await ask("\n✅ Are you satisfied with the structure? (yes/no): ");
        if (satisfied.toLowerCase() === "yes") break;
      }
    }

    close();

    // Finish message
    console.log(theme.success(`\n🎉 Project ${projectName} is ready!\n`));
    console.log(theme.muted(`  cd ${projectName}`));
    console.log(theme.muted("  npm install"));
    console.log(theme.muted("  npm run dev"));

  } catch (err) {
    console.error(theme.error(`❌ Failed: ${(err as Error).message}`));
  }
};

