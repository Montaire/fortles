import EventSourceService from "@fortles/addon.event-source";
import { AssetService, MimeType, ScriptAsset, Service } from "@fortles/core";
import fs from "fs";
export default class HotReloadService extends Service {
    clients = [];
    application;
    async prepare(application) {
        this.application = application;
        let asset = new ScriptAsset(await import.meta.resolve("../asset/hot-reload.js"));
        application.getService(AssetService).add(asset);
    }
    /**
     * Watch the templates.
     */
    watchTemplates() {
        let engine = this.application.getRenderEngines().get("text/html");
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
    reloadTemplate(path, name = null) {
        let engine = this.application.getRenderEngines().get("text/html");
        let factory = engine.getTemplateFactory();
        factory.createTemplate(path);
        this.reloadBlock();
    }
    /**
     * Reloads a block on the clients side.
     * @param blockPath The block path or empty to reload the main block
     */
    reloadBlock(blockPath = "") {
        this.container.send("reload-block", blockPath);
    }
    /**
     * Reloads the whole document without navigation.
     */
    reloadAll() {
        this.container.send("reload-all");
    }
    /**
     * Full page reload.
     */
    reload() {
        this.container.send("reload");
    }
    /**
     * Reloads an asset.
     * Supply the mime type to reload to reload only the asset if possible.
     * The source not required.
     * @param asset Asset to reload.
     */
    reloadAsset(asset) {
        switch (asset.mime) {
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
    /**
     * Hangs up the open connection for each client.
     */
    dropClients() {
        this.container.dropClients();
    }
    getPriority() {
        return 101;
    }
    getContainerType() {
        return EventSourceService;
    }
}
//# sourceMappingURL=HotReloadService.js.map