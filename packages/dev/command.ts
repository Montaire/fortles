import { Command } from "@fortles/cli";

export default function(command: Command){
    command.subCommand("dev")
        .description("Development console.")
        .subCommand("server")
            .description("Starts a development server. Also handles migrations if plugin is enabled.")
            .option("port", "Port", {short: "p", variable: Number})
            .option("path", "Custom path to the project", {variable: String})
            .option("watchFramework", "Enable watcher for internal framework changes. Meant to be used for the framework developers.")
            .option("noWatchProject", "Disable watcher for the project dictionary.")
            .action(config => {
            });
}