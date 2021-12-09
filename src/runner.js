import { spawn } from "child_process";

function run(filepath) {
    return new Promise((resolve, reject) => {
        try {
            let stdout = "";
            const program = spawn(exe, { timeout });
            let StartTime = Date.now();

            program.on("close", (code) => {
                resolve({ code, stdout, time: Date.now() - StartTime });
            });

            program.stdout.on("data", (data) => {
                stdout += data;
            });

            if (input) {
                program.stdin.write(input);
                program.stdin.end();
            }
        } catch (err) {
            reject(err);
        }
    });
}

export default run;
