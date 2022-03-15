import { TemplateRenderEngine } from "../core/render/RenderEngine.js";
import {  RenderEngine, Request, Response } from "@fortles/core";
import { Template, TemplateFactory } from "../core/template/index.js";

export default class TestRenderEngine extends TemplateRenderEngine{

    public dispatch(request: Request, response: Response): void {
        let route = response.getController().getRouter().getRoute(request);
        let template = this.templates.get(route.getTemplate());
        template.render(this, request, response);
    }

    public setTemplate(name: string, template: Template): void{
        this.templates.set(name, template);
    }

}