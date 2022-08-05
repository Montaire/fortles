import { Command } from "@fortles/cli";

export default function(command: Command){
    command.addCommand("dev")
        .setDescription("Development console.")
        .addCommand("server")
            .setTitle("Fortles Development Server")
            .setDescription("Starts a development server. Also handles migrations if plugin is enabled.")
            .addOption("port", "Port.", {short: "p", variableType: Number, default: 8080, required:true})
            .addOption("path", "Custom path to the project.")
            .addFlag("watchFramework", "Enable watcher for internal framework changes. Meant to be used for the framework developers.")
            .addFlag("noWatchProject", "Disable watcher for the project dictionary.")
            .setAction(config => {
                console.log(config);
            });
}