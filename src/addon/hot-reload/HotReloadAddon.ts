import { Addon, Application, AssetService, ScriptAsset, Service, HtmlRenderEngine, Asset, MimeType } from "@fortles/core";
import EventSourceService from "@fortles/addon.event-source";
import fs from "fs";
import * as http from "http";

export default class HotReloadAddon extends Service<EventSourceService> implements Addon{

    protected clients: http.ServerResponse[] = [];
    protected application: Application;

    public async prepareAddon(application: Application): Promise<void> {
        this.application = application;
        application.registerAddon(EventSourceService);
        let asset = new ScriptAsset(await import.meta.resolve("./asset/hot-reload.js"));
        application.getService(AssetService).add(asset);
    }

    public prepare(application: Application): void {
    }

    /**
     * Watch the templates.
     */
    public watchTemplates(){
        let engine = this.application.getRenderEngines().get("text/html") as HtmlRenderEngine;
        let factory = engine.getTemplateFactory();
        factory.transverse((path, name) => {
            fs.watch(path, (eventType, fileName) => {
                factory.createTemplate(name, path);
                this.reloadBlock();
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
     * Reloads the whole document without navigation.
     */
    public reloadAll(){
        this.container.send("reload-all");
    }

    /**
     * Full page reload.
     */
    public reload(){
        this.container.send("reload");
    }

    /**
     * Reloads an asset.
     * Supply the mime type to reload to reload only the asset if possible.
     * The source not required.
     * @param asset Asset to reload.
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
                this.reload();
                break;
        }
    }

    public dropClients(){
        this.container.dropClients();
    }

    public getPriority(): number {
        return 101;
    }

    public getContainerType(): new () => EventSourceService {
        return EventSourceService;
    }

}