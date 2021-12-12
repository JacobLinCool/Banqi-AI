import fs from "fs";
import { resolve } from "path";
import InteractiveRunner from "./runner";
import play from "./play";

const { executable, flags } = get_arguments();

if (!executable || fs.existsSync(resolve(executable)) === false) {
    console.error("No executable provided or executable does not exist");
    console.log("Usage: bqai <executable> [flags]");
    console.log("Flags:");
    console.log("  -b: Buffer timeout in milliseconds.");
    console.log("  -d: Reaction delay in milliseconds.");
    console.log("  -o: Output file path.");
    console.log("  -r: Realtime debugging mode.");
    process.exit(1);
}

const runner = new InteractiveRunner(resolve(executable));

runner.on("buffered", play);

runner.on("data", ({ data }) => {
    if (data.trim() === "To (x,y): Out of area!") {
        process.exit(1);
    }
});

runner.on("error", ({ err }) => {
    console.error(err);
});

runner.on("exit", ({ code }) => {
    console.log(`Program exited with code ${code}`);
});

const run = runner.run({ realtime: flags["r"], buffer_timeout: flags["b"] ? flags["b"][0] : 10, delay: flags["d"] ? flags["d"][0] : 10 });

run.result.then(() => {
    if (flags["o"]) fs.writeFileSync(resolve(process.cwd(), flags["o"][0]), run.log);
});

function get_arguments() {
    const args = process.argv.slice(2);
    const executable = args.shift();

    const flags: { [key: string]: any } = {};
    let flag = null;
    for (let i = 0; i < args.length; i++) {
        if (args[i][0] === "-") {
            flag = args[i].substring(1);
            flags[flag] = [];
        } else {
            if (flag) {
                flags[flag].push(args[i]);
            }
        }
    }

    return { executable, flags };
}
