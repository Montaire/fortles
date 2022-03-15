import { Addon, Application } from "@fortles/core";
import AssetMiddleware from "./middleware/AssetMiddleware.js";

/**
 * This addons can catch paths where assetfiles are located, and serves them.
 */
export default class AssetAddon implements Addon{
    public prepare(application: Application): void {
        let assetMiddleware = new AssetMiddleware();
        application.addMiddleware(assetMiddleware);
    }
    
}