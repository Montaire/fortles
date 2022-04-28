import HotReloadAddon from "@fortles/addon.hot-reload";
import { Application, Asset, AssetService, Controller, Mime, MimeType } from "@fortles/core";
import { ServerPlatform } from "@fortles/platform.server";
import { resolve } from "path";
import { argv } from "process";
import { pathToFileURL } from "url";
import { DevelopmentServerConfig } from "./DevelopmentServer.js";
import { RunMessage } from "./index.js";

process.on("exit", (code) => {
    console.info("Development server stopped.");
});

let runtimeConfig = JSON.parse(argv.pop()) as DevelopmentServerConfig;


let rootPath = process.cwd();
let pathUrl = pathToFileURL(runtimeConfig.path ? resolve(rootPath, runtimeConfig.path) : rootPath);
let mainController: Controller = null;
let configUrl = pathUrl + "/src/config.js";
let config = null;

try{
    config = await import(pathUrl + "/src/config.js");
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

let platform = new ServerPlatform(runtimeConfig.port, [rootPath + "/template"]);
let application = new Application(platform, mainController);

if(config && config.default){
    config.default(application);
}else{
    console.log(config);
    console.warn("No default export found in the config file: '" + configUrl + "'");
}

//Prepare watches
application.registerAddon(HotReloadAddon);

application.run();

console.info("Development server started at http://localhost:" + runtimeConfig.port + "");

//Process messages form dev server
process.on("message", (message: RunMessage) => {
    switch(message.action){
        case "exit":
            console.info("Stopping development server.");
            process.exit();
        case "reload":
            let mime = Mime.detect(message.data);
            if(mime == MimeType.HTML){
                application.getService(HotReloadAddon).reloadTemplate(message.data);
            }else{
                //If asset in the asset folder
                let result = message.data.match(/.+?asset[\//](.+)$/);
                if(result){
                    let asset = new Asset(message.data, result[1]);
                    application.getService(HotReloadAddon).reloadAsset(asset);
                    return;
                }

                //If the asset loaded via class
                for(const asset of application.getService(AssetService)){
                    if(asset.source == message.data){
                        application.getService(HotReloadAddon).reloadAsset(asset);
                        return;
                    }
                }
                //TODO: If asset not found
                console.error("Template not found.");
            }
    }
});