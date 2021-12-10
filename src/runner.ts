import { spawn } from "child_process";
import EventEmitter from "events";
import fs from "fs";
import path from "path";

type ProgramEvent = "error" | "exit" | "data" | "buffered";

class InteractiveRunner extends EventEmitter {
    constructor(private executable_path: string) {
        super();
    }

    run({ buffer_timeout, realtime }: { buffer_timeout?: number; realtime?: boolean } = { buffer_timeout: 10, realtime: false }) {
        const fstream = realtime ? fs.createWriteStream(path.join(__dirname, "stdio.txt")) : null;
        let log = "";
        const result = new Promise((resolve, reject) => {
            const program = spawn(this.executable_path, { shell: true });
            let buffer = "",
                buffering = false,
                buffer_timer: NodeJS.Timeout | null = null;

            console.log(program.pid);

            program.on("error", (err) => {
                this.emit("error", { program, err });
                reject(err);
            });

            program.on("exit", (code) => {
                this.emit("exit", { program, code });
                resolve(code);
            });

            program.stdout.on("data", (data) => {
                data = data.toString();
                if (realtime && fstream) {
                    fstream.write(data);
                }
                this.emit("data", { program, send, data });
                log += data;

                if (buffering) {
                    buffer += data;

                    if (buffer_timer) {
                        clearTimeout(buffer_timer);
                    }
                } else {
                    buffer = data;
                    buffering = true;
                }

                buffer_timer = setTimeout(() => {
                    buffering = false;
                    this.emit("buffered", { program, send, buffer });
                    buffer = "";
                }, buffer_timeout);
            });

            function send(data: string): void {
                if (realtime && fstream) {
                    fstream.write(data);
                }
                program.stdin.write(data);
                log += data;
            }
        });

        return { result, log };
    }

    on(event: ProgramEvent, listener: (...args: any[]) => void): this {
        super.on(event, listener);
        return this;
    }
}

export default InteractiveRunner;
