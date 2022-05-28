import { AssetService, StyleAsset } from "@fortles/core";
export default class BootstrapAddon {
    async prepare(application) {
        let asset = new StyleAsset(await import.meta.resolve("bootstrap/dist/css/bootstrap.min.css"));
        application.getService(AssetService).add(asset);
    }
}
//# sourceMappingURL=BootstrapAddon.js.map