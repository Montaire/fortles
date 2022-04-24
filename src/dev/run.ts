import { RunMessage } from "./index.js";
import { Application, Controller } from "@fortles/core";
import { ServerPlatform } from "@fortles/platform.server";
import { pathToFileURL } from "url";
import { resolve } from "path"
import { argv } from "process";
import { DevelopmentServerConfig } from "./DevelopmentServer.js";

process.on("exit", (code) => {
    console.info("Development server stopped.");
});

process.on("message", (message: RunMessage) => {
    switch(message.action){
        case "exit":
            console.info("Stopping development server.");
            process.exit();
            break;
    }
});

let runtimeConfig = JSON.parse(argv.pop()) as DevelopmentServerConfig;

let platform = new ServerPlatform(runtimeConfig.port);

let path = process.cwd();
let pathUrl = pathToFileURL(runtimeConfig.path ? resolve(path, runtimeConfig.path) : path);
let mainController: Controller = null;
let configUrl = pathUrl + "/config.js";
let config = null;

try{
    let config = await import(pathUrl + "/config.js");
    if(config.mainController instanceof Function){
        mainController = config.mainController();
    }
} catch (error){
    console.warn("Configuration file not found at '" + configUrl + "'");
}

if(mainController == null){
    let mainControllerUrl = pathUrl + "/controller/MainController.js";
    try{
        mainController = (await import(mainControllerUrl)).default;
    } catch (error){
        console.error("Main Controller not found at '" + mainControllerUrl + "' nor in hte config. Call this script from the root of your project.");
        process.exit();
    }
}

let application = new Application(platform, mainController);

if(config && config.default){
    config.default(application);
}

application.run();

console.info("Development server started at http://localhost:" + runtimeConfig.port + "");