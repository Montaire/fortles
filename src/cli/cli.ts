import { Command } from "commander";
import { argv } from "process";
import  { DevelopmentServer } from "@fortles/dev";

let program = new Command();

program.name("fortles")
    .description("Fortles Console")
    .version("0.1.0");

program.command("dev")
    .alias("development")
    .description("Development Console")
    .command("server")
        .description("Starts a development server")
        .option("-p, --port <port>", 'Port')
        .option("--path <path>", "Path of the project")
        .action((config) => {
            let developmentServer = new DevelopmentServer();
            developmentServer.start(config);
        });

program.parse(argv);