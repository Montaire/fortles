import { TemplateFactory } from "../index.js";
export class RenderEngine {
    /**
     * Fired before the response
     * @param request
     * @param response
     */
    beforeRender(request, response) { }
    /**
     *
     * @param request
     * @param response
     */
    afterRender(request, response) { }
}
export var RenderEngineContentPlace;
(function (RenderEngineContentPlace) {
    RenderEngineContentPlace[RenderEngineContentPlace["HEADER"] = 0] = "HEADER";
    RenderEngineContentPlace[RenderEngineContentPlace["BFEORE_CONTENT"] = 1] = "BFEORE_CONTENT";
    RenderEngineContentPlace[RenderEngineContentPlace["AFTER_CONTENT"] = 2] = "AFTER_CONTENT";
})(RenderEngineContentPlace || (RenderEngineContentPlace = {}));
export class ContentAvareRenderEngine extends RenderEngine {
}
export class TemplateRenderEngine extends ContentAvareRenderEngine {
    templates = new TemplateFactory();
    getTemplate(name) {
        return this.templates.get(name);
    }
    getTemplateFactory() {
        return this.templates;
    }
}
//# sourceMappingURL=RenderEngine.js.map