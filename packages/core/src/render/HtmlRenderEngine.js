import * as fs from "fs";
import { ScriptAsset, StyleAsset } from "../asset/Asset.js";
import { RuntimeError } from "../Error.js";
import { AssetService, HttpError, NotFoundError } from "../index.js";
import { RenderEngineContentPlace as ContentPlace, TemplateRenderEngine } from "./RenderEngine.js";
export default class HtmlRenderEngine extends TemplateRenderEngine {
    header = "";
    afterConetent = "";
    beforeContent = "";
    constructor(application, templatePaths) {
        super();
        application.register(AssetService);
        for (const templatePath of templatePaths) {
            if (!fs.existsSync(templatePath)) {
                throw new RuntimeError("There is no folder with templates on the'" + templatePath + "'");
            }
            this.templates.build(templatePath);
        }
    }
    dispatch(request, response) {
        try {
            let route = response.getController().getRouter().getRoute(request);
            if (!route) {
                throw new NotFoundError("Route not found");
            }
            let template = this.templates.get(route.getTemplate());
            if (!template) {
                throw new Error('Template can not be found "' + route.getTemplate() + '"');
            }
            template.render(this, request, response);
        }
        catch (error) {
            if (error instanceof HttpError) {
                let template = this.templates.get('error');
                if (template) {
                    template.render(this, request, response);
                }
                else {
                    response.write(error.getCode() + ': ' + error.getMessage());
                }
            }
            else {
                throw error;
            }
        }
    }
    beforeRender(request, response) {
        response.write("<!DOCTYPE html><html><head>");
        let headerTemplate = this.templates.get("header");
        if (headerTemplate) {
            headerTemplate.render(this, request, response);
        }
        if (this.header) {
            response.write(this.header);
        }
        response.write("</head><body>");
        if (this.beforeContent) {
            response.write(this.beforeContent);
        }
    }
    afterRender(request, response) {
        if (this.afterConetent) {
            response.write(this.afterConetent);
        }
        response.write('</body></html>');
    }
    addAssetToContent(asset) {
        if (asset instanceof ScriptAsset) {
            this.addContent('<script src="' + asset.path + '" ></script>', asset.place);
        }
        if (asset instanceof StyleAsset) {
            this.addContent('<link rel="stylesheet" href="' + asset.path + '">', asset.place);
        }
    }
    addContent(content, place) {
        switch (place) {
            case ContentPlace.HEADER:
                this.header += content;
                break;
            case ContentPlace.BFEORE_CONTENT:
                this.beforeContent += content;
                break;
            case ContentPlace.AFTER_CONTENT:
                this.afterConetent += content;
                break;
        }
    }
}
//# sourceMappingURL=HtmlRenderEngine.js.map