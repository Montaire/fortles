import * as fs from "fs";
import { Command } from "./index.js";

let packageJson = JSON.parse(fs.readFileSync("./package.json", {encoding: "utf-8"}));

let fortlesCommand = new Command();

fortlesCommand.run();