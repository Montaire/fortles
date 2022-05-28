import { ContentAvareRenderEngine, NotFoundError, Service } from "../index.js";
import Path from "path";
import fs from "fs";
export default class AssetService extends Service {
    map = new Map();
    application;
    prepare(applcation) {
        this.application = applcation;
        this.listenOnPartialPath("asset");
    }
    onRequest(request, response) {
        let mime = null;
        let path = request.getPath();
        if (this.map.has(path)) {
            let asset = this.map.get(path);
            path = asset.source;
            mime = asset.mime;
        }
        else {
            path = "." + path;
            mime = this.resolveMime(Path.extname(path));
        }
        if (path.search("..")) {
            throw new NotFoundError("The path is invalid");
        }
        ;
        if (!fs.existsSync(path)) {
            throw new NotFoundError("File not found");
        }
        if (mime) {
            response.setMime(mime);
        }
        if (response.getStream()) {
            let stream = fs.createReadStream(path);
            stream.pipe(response.getStream());
        }
        else {
            let data = fs.readFileSync(path);
            response.write(data);
        }
    }
    resolveMime(extension) {
        switch (extension) {
            case 'css': return 'text/css';
            case 'js': return 'text/javascript';
            default: return null;
        }
    }
    /**
     * Add a new asset.
     * @param asset The asset class
     * @param useRoot Use the /asset prefix.
     */
    add(asset) {
        this.map.set(asset.path, asset);
        //subscribe with the custom path
        if (asset.useRoot) {
            this.listenOnFullPath(asset.path, asset.useRoot);
        }
        //add to the corresponding render engines.
        for (const engine of this.application.getRenderEngines().values()) {
            if (engine instanceof ContentAvareRenderEngine) {
                engine.addAssetToContent(asset);
            }
        }
        return this;
    }
    getContainerType() {
        return null;
    }
    [Symbol.iterator]() {
        return this.map.values();
    }
}
//# sourceMappingURL=AssetService.js.map