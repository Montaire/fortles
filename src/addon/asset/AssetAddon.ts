import { Addon, Application, Middleware } from "@montaire/e-core";
import AssetMiddleware from "./middleware/AssetMiddleware.js";

/**
 * This addons can catch paths where assetfiles are located, and serves them.
 */
export default class AssetAddon extends Addon{
    public prepare(application: Application): void {
        let assetMiddleware = new AssetMiddleware();
        application.addMiddleware(assetMiddleware);
    }
    
}