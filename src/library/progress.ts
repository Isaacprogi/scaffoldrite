import cliProgress from "cli-progress";
import chalk from "chalk";

interface ProgressUpdate {
  type: string;
  path: string;
  count: number;
}

interface ProgressBarControls {
  start: (total: number) => void;
  update: (e: ProgressUpdate) => void;
  stop: () => void;
  log: (message: string) => void; 
}

export function createProgressBar(): ProgressBarControls {
  const bar = new cliProgress.SingleBar(
    {
      format:
        `${chalk.hex('#4cc9f0')("{bar}")} ` +
        `${chalk.hex('#00b4d8').bold("{percentage}%")} ` +
        `${chalk.hex('#4cc9f0')("|")} ` +
        `${chalk.hex('#f8f9fa')("{value}")}${chalk.hex('#adb5bd')("/{total}")} ` +
        `${chalk.hex('#4cc9f0')("|")} ` +
        `${chalk.hex('#ffd166').bold("{type}")} ` +
        `${chalk.hex('#8d99ae').italic("{path}")}`,
      
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      clearOnComplete: false,
      stopOnComplete: true,
      barsize: 40,
      forceRedraw: true, 
    },
    cliProgress.Presets.shades_classic
  );

  let totalOps = 0;
  let startTime = Date.now();

  return {
    start(total: number) {
      totalOps = total;
      startTime = Date.now();
      bar.start(total, 0, { 
        type: "", 
        path: "",
        percentage: 0 
      });
    },

    update(e: ProgressUpdate) {
      const percentage = Math.floor((e.count / totalOps) * 100);
      
      if (percentage === 100) {
        const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
        bar.update(e.count, {
          type: "OPERATIONS",
          path: `Finished in ${elapsedSeconds}s`,
          percentage: percentage,
        });
      } else {
        bar.update(e.count, {
          type: e.type.toUpperCase(),
          path: e.path,
          percentage: percentage,
        });
      }
    },

    log(message: string) {
      // This helper prevents the "double bar" by clearing the line first
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      console.log(message);
    },

    stop() {
      bar.stop();
    },
  };
}

// Note: Ensure 'readline' is available if using the log helper, 
// otherwise standard console.warn works better with forceRedraw enabled.
import readline from "readline";