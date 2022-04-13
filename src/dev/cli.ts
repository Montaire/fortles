import { Command } from "commander";

let program = new Command();

program.name("fortles")
    .description("Fortles Developer Console")
    .version("0.1.0");

program.command("server")
    .description("Start a Developent server");

program.parse();