import { Addon, Application, AssetService, Middleware, Request, Response, ScriptAsset, Service, HtmlRenderEngine } from "@fortles/core";
import EventSourceService from "@fortles/addon.event-source";
import fs from "fs";
import * as http from "http";

export default class HotReloadAddon extends Service<EventSourceService> implements Addon{

    protected clients: http.ServerResponse[] = [];

    public async prepareAddon(application: Application): Promise<void> {
        let asset = new ScriptAsset(await import.meta.resolve("./asset/hot-reload.js"));
        application.getService(AssetService).add(asset);
        
    }

    public prepare(application: Application): void {
        this.watchTemplateFolder(application);
    }

    public watchTemplateFolder(application: Application, prefix:string = null){
        let engine = application.getRenderEngines().get("text/html") as HtmlRenderEngine;
        let factory = engine.getTemplateFactory();
        factory.transverse((name, path) => {
            fs.watch(path, (eventType, fileName) => {
                this.container.send("hot-reload", "");
            });
        });
    }

    public reload(blockPath: string = ""){
        this.container.send("hot-reload", blockPath);
    }

    public getPriority(): number {
        return 101;
    }


}