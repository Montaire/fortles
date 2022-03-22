import { RenderEngineContentPlace, TemplateRenderEngine } from "../core/render/RenderEngine.js";
import {  Asset, RenderEngine, Request, Response } from "@fortles/core";
import { Template, TemplateFactory } from "../core/template/index.js";

export default class TestRenderEngine extends TemplateRenderEngine{
    
    public addAssetToContent(asset: Asset): void {
        throw new Error("Method not implemented.");
    }

    public dispatch(request: Request, response: Response): void {
        let route = response.getController().getRouter().getRoute(request);
        let template = this.templates.get(route.getTemplate());
        template.render(this, request, response);
    }

    public setTemplate(name: string, template: Template): void{
        this.templates.set(name, template);
    }

}