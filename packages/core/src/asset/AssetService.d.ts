import { Request, Response, Service, Asset, Application } from "../index.js";
import DefaultServiceContainer from "../service/DefaultServiceContainer.js";
export default class AssetService extends Service implements Iterable<Asset> {
    protected map: Map<string, Asset>;
    protected application: Application;
    prepare(applcation: Application): void;
    onRequest(request: Request, response: Response): void;
    resolveMime(extension: string): string;
    /**
     * Add a new asset.
     * @param asset The asset class
     * @param useRoot Use the /asset prefix.
     */
    add(asset: Asset): this;
    getContainerType(): new () => DefaultServiceContainer;
    [Symbol.iterator](): Iterator<Asset>;
}
