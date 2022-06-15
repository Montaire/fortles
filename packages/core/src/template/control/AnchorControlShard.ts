import { InvalidTemplateError, Request, Response } from "../../index.js";
import { RenderEngine } from "../../render/index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";

export default class AnchorControlShard extends ControlShard {

    protected url: string;

    public initialize(reader: CharacterStreamReader): void {
        let canonicalUrl = this.attributes.get("href");
        if(canonicalUrl == null){
            throw new InvalidTemplateError("<f:a> needs a 'href' attribute", reader);
        }
        if(!canonicalUrl.includes(".")){
            let templatePrefix = this.getTemplateName();
            templatePrefix = templatePrefix.substring(0, templatePrefix.lastIndexOf('.'));
            canonicalUrl = templatePrefix + "." + canonicalUrl;
        }
        this.url = canonicalUrl.substring(0, canonicalUrl.indexOf('(')).replace(".", "/");
    }

    public getName(): string {
        return "a";
    }

    public override render(engine: RenderEngine, request:Request, response: Response): void{
        response.write("<a href=\"" + this.url + "\" onclick=\"Fortles.go(this)\">");
        super.render(engine, request, response);
        response.write("</a>");
    }
}