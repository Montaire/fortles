import { Addon, Application, AssetService, ScriptAsset, Service, HtmlRenderEngine, Asset, MimeType, Path } from "@fortles/core";
import EventSourceService from "@fortles/addon.event-source";
import fs from "fs";
import * as http from "http";

export default class HotReloadAddon extends Service<EventSourceService> implements Addon{

    protected clients: http.ServerResponse[] = [];
    protected application: Application;

    public prepareAddon(application: Application): void {
        this.application = application;
        application.registerAddon(EventSourceService);
        let asset = new ScriptAsset(Path.resolveMeta("./asset/hot-reload.js", import.meta));
        application.getService(AssetService).add(asset);
    }

    public prepare(application: Application): void {
    }

    public watchTemplateFolder(prefix:string = null){
        let engine = this.application.getRenderEngines().get("text/html") as HtmlRenderEngine;
        let factory = engine.getTemplateFactory();
        factory.transverse((path, name) => {
            fs.watch(path, (eventType, fileName) => {
                factory.createTemplate(name, path);
                this.container.send("hot-reload", "");
            });
        });
    }

    /**
     * Replaces a template int the server side, and reloads the client.
     * @param path Path to the template file.
     * @param name Name of the template. If emtpy ot will be calculated from tzhe file name.
     */
    public reloadTemplate(path: string, name: string = null){
        let engine = this.application.getRenderEngines().get("text/html") as HtmlRenderEngine;
        let factory = engine.getTemplateFactory();
        factory.createTemplate(path);
        this.reloadBlock();
    }

    /**
     * Reloads a block on the clients side.
     * @param blockPath The block path or empty to reload the main block
     */
    public reloadBlock(blockPath: string = ""){
        this.container.send("reload-block", blockPath);
    }

    /**
     * Reloads an asset.
     * @param asset 
     */
    public reloadAsset(asset: Asset){
        switch(asset.mime){
            case MimeType.JS: 
                this.container.send("reload-script", asset.path);
                break;
            case MimeType.CSS: 
                this.container.send("reload-style", asset.path);
                break;
            default:
                this.container.send("reload-asset", asset.path);
                break;
        }
    }

    public getPriority(): number {
        return 101;
    }

    public getContainerType(): new () => EventSourceService {
        return EventSourceService;
    }

}