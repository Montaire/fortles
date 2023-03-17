import {  Asset, TemplateRenderEngine, Request, Response, Template, NotFoundError } from "@fortles/core";

export default class TestRenderEngine extends TemplateRenderEngine{
    
    public addAssetToContent(asset: Asset): void {
        throw new Error("Method not implemented.");
    }

    public dispatch(request: Request, response: Response): void {
        let router = response.getController().getRouter();
        let route = router.getRoute(request);
        if(!route){
            throw new NotFoundError("Route for '" + request.getPath() + "' not found!");
        }
        let template = this.templates.get(route.getTemplate() as string);
        if(!template){
            throw new NotFoundError("'" + route.getTemplate() + "' template not found!");
        }
        template.render(this, request, response);
    }

    public setTemplate(template: Template): void{
        this.templates.set(template);
    }

}