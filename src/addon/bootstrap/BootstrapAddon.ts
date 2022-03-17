import { Addon, Application, StyleAsset } from "@fortles/core";
import Path from "path";
import * as url from "url";

export default class BootstrapAddon implements Addon{
    async prepare(application: Application): Promise<void> {
        let asset = new StyleAsset(await import.meta.resolve("bootstrap/dist/css/bootstrap.min.css"));
        application.addAsset(asset);
    }

}