import * as readline from "readline";
import * as process from "process";
import * as fs from "fs";
import Bot from "./Bot";

const rl = readline.createInterface(process.stdin, process.stdout)
const bot: Bot = new Bot();

rl.on("line", (line: string) => {
    const [type, ...rest] = line.split(" ");
    if (type == "settings") {
        const [variable, value] = rest;
        bot.settings(variable, value);
    }
    if (type == "update") {
        bot.update(rest.join(" "));
    }
    if (type == "action") {
        bot.action();
    }
});

rl.on("close", () => {
    process.exit(0);
});
