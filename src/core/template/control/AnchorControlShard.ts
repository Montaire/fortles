import { InvalidTemplateError, Request, Response } from "../../index.js";
import { RenderEngine } from "../../render/index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";

export default class AnchorControlShard extends ControlShard {

    //protected translateUrl: TranslateFormat;
    protected isGo: boolean = true;
    protected url: string;

    public initialize(reader: CharacterStreamReader): void {
        let canonicalUrl = this.attributes.get("go");
        
        if(canonicalUrl == null){
            canonicalUrl = this.attributes.get("do");
            this.isGo = false;
        }
        if(canonicalUrl == null){
            throw new InvalidTemplateError("<e:a> needs a 'go' or 'do' attribute", reader);
        }
        if(!canonicalUrl.includes(".")){
            let templatePrefix = this.getTemplateName();
            templatePrefix = templatePrefix.substring(0, templatePrefix.lastIndexOf('.'));
            canonicalUrl = templatePrefix + "." + canonicalUrl;
        }
        this.url = canonicalUrl.substring(0, canonicalUrl.indexOf('('));
        //TODO let translateUrl = new TranslateFormat(canonicalUrl, this.getApplication().getRouteTranslator());
    }

    public getName(): string {
        return "a";
    }

    public render(engine: RenderEngine, request:Request, response: Response): void{
        //let url = translateUrl.format(response.getData(), response.getLocale());
        if(this.isGo){
            response.write("<a href=\"" + this.url + "\" onclick=\"E.go(this)\">");
            super.render(engine, request, response);
            response.write("</a>");
        }else{
            response.write("<form class=\"e-action\" onsubmit=\"E.do(this)\"><button>");
            super.render(engine, request, response);
            response.write("</button></form>");
        }
    }
}