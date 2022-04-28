import { Command } from "commander";
import { argv } from "process";
import  { DevelopmentServer } from "@fortles/dev";

let program = new Command();

program.name("fortles")
    .description("Fortles Console")
    .version("0.1.0");

if(DevelopmentServer){
    program.command("dev")
        .alias("development")
        .description("Development Console")
        .command("server")
            .description("Starts a development server")
            .option("-p, --port <port>", 'Port')
            .option("--path <path>", "Custom path to the project")
            .option("--watchFramework", "Enable watcher for internal framework changes. Meant to be used for the framework developers.")
            .option("--no-watchProject", "Disable watcher for the project dictionary.")
            .action((config) => {
                let developmentServer = new DevelopmentServer();
                developmentServer.start(config);
            });
}else{
    program.command("dev")
        .alias("development")
            .description("To use the dev commands intall the '@fortles/dev' package");
}
program.parse(argv);