import { TemplateRenderEngine, NotFoundError } from "@fortles/core";
export default class TestRenderEngine extends TemplateRenderEngine {
    addAssetToContent(asset) {
        throw new Error("Method not implemented.");
    }
    dispatch(request, response) {
        let router = response.getController().getRouter();
        let route = router.getRoute(request);
        if (!route) {
            throw new NotFoundError("Route for '" + request.getPath() + "' not found!");
        }
        let template = this.templates.get(route.getTemplate());
        if (!template) {
            throw new NotFoundError("'" + route.getTemplate() + "' template not found!");
        }
        template.render(this, request, response);
    }
    setTemplate(template) {
        this.templates.set(template);
    }
}
//# sourceMappingURL=TestRenderEngine.js.map