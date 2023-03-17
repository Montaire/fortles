import { Addon, Application, AssetService, StyleAsset } from "@fortles/core";

export default class BootstrapAddon implements Addon{
    async prepare(application: Application): Promise<void> {
        if(!import.meta.resolve){
            throw Error("import.meta.resolve not enabled on your system.")
        }
        let asset = new StyleAsset(await import.meta.resolve("bootstrap/dist/css/bootstrap.min.css"));
        application.getService(AssetService).add(asset);
    }

}