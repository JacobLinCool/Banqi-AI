import fs from "fs";
import { resolve } from "path";
import InteractiveRunner from "./runner";
import play from "./play";

const runner = new InteractiveRunner(resolve(__dirname, "..", "game", "game" + (process.platform === "win32" ? ".exe" : "")));

runner.on("buffered", play);

runner.on("error", ({ err }) => {
    console.error(err);
});

runner.on("exit", ({ code }) => {
    console.log(`Program exited with code ${code}`);
});

const run = runner.run();

run.result.then(() => {
    fs.writeFileSync(resolve(__dirname, "game.log"), run.log);
});
