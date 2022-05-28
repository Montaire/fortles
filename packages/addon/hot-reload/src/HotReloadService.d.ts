/// <reference types="node" />
import EventSourceService from "@fortles/addon.event-source";
import { Addon, Application, Asset, Service } from "@fortles/core";
import * as http from "http";
export default class HotReloadService extends Service<EventSourceService> implements Addon {
    protected clients: http.ServerResponse[];
    protected application: Application;
    prepare(application: Application): Promise<void>;
    /**
     * Watch the templates.
     */
    watchTemplates(): void;
    /**
     * Replaces a template int the server side, and reloads the client.
     * @param path Path to the template file.
     * @param name Name of the template. If emtpy ot will be calculated from tzhe file name.
     */
    reloadTemplate(path: string, name?: string): void;
    /**
     * Reloads a block on the clients side.
     * @param blockPath The block path or empty to reload the main block
     */
    reloadBlock(blockPath?: string): void;
    /**
     * Reloads the whole document without navigation.
     */
    reloadAll(): void;
    /**
     * Full page reload.
     */
    reload(): void;
    /**
     * Reloads an asset.
     * Supply the mime type to reload to reload only the asset if possible.
     * The source not required.
     * @param asset Asset to reload.
     */
    reloadAsset(asset: Asset): void;
    /**
     * Hangs up the open connection for each client.
     */
    dropClients(): void;
    getPriority(): number;
    getContainerType(): new () => EventSourceService;
}
