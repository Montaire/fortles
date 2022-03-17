import { Addon, Application } from "@fortles/core";
import Path from "path";
import * as url from "url";

export default class BootstrapAddon implements Addon{
    async prepare(application: Application): Promise<void> {
        let path = await import.meta.resolve("bootstrap");
        path = path + "/../../css/bootstrap.min.css";
        application.addStyleAsset("/bootsrap.min.css", path);
    }

}