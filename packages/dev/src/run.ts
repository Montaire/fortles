import HotReloadService from "@fortles/addon.hot-reload";
import { Application, Asset, AssetService, Controller, Mime, MimeType } from "@fortles/core";
import { ServerPlatform } from "@fortles/platform.server";
import * as Path from "path";
import { argv } from "process";
import { pathToFileURL } from "url";
import { DevelopmentServerConfig } from "./DevelopmentServer.js";
import { RunMessage } from "./index.js";

process.on("exit", (code) => {
    console.info("Development server stopped.");
});

let runtimeConfig = JSON.parse(argv.pop() ?? '{}') as DevelopmentServerConfig;

let platform = new ServerPlatform(runtimeConfig.port ?? 80, [process.cwd() + "/template"]);
let application = await Application.create(platform, runtimeConfig.path);

//Prepare watches
application.register(HotReloadService);

application.run();

console.info("Development server started at http://localhost:" + runtimeConfig.port + "");

//Process messages form dev server
process.on("message", (message: RunMessage) => {
    if(!message.data){
        return;
    }
    switch(message.action){
        case "exit":
            console.info("Stopping development server.");
            if(message.data == "reload"){
                application.getService(HotReloadService).reloadAll();
                application.getService(HotReloadService).dropClients();
                process.exit();
            }else{
                process.exit(Number.parseInt(message.data));
            }
        case "reload":
            let mime = Mime.detect(message.data);
            if(mime == MimeType.HTML){
                application.getService(HotReloadService).reloadTemplate(message.data);
            }else{
                //If asset in the asset folder
                message.data = Path.normalize(message.data);
                let result = message.data.match(/.+?asset(.+)$/);
                if(result){
                    const name = result[1].split(Path.sep).join(Path.posix.sep).substring(1);
                    const asset = new Asset(message.data, name, Mime.detect(message.data));
                    application.getService(HotReloadService).reloadAsset(asset);
                    console.info("Hot Reload: " + message.data);
                    return;
                }

                //If the asset loaded via class
                for(const asset of application.getService(AssetService)){
                    if(asset.source == message.data){
                        application.getService(HotReloadService).reloadAsset(asset);
                        console.info("Hot Reload: " + message.data);
                        return;
                    }
                }
                //TODO: If asset not found
                console.error("Hot Reload: Asset not found");
            }
    }
});