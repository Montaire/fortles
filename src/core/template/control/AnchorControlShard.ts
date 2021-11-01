import { InvalidTemplateError } from "../../Error";
import CharacterStreamReader from "../../utility/CharacterStreamReader";
import { ControlShard, TemplateShard} from "../";
import { Request, Response} from "../../../";
import RenderEngine from "../../render/RenderEngine";

export default class AnchorControlShard extends ControlShard {

    //protected translateUrl: TranslateFormat;
    protected isGo: boolean = true;
    
    public constructor(reader: CharacterStreamReader, parent: TemplateShard) {
        super(reader, parent, "a");
        let canonicalUrl = this.attributes.get("go");
        
        if(canonicalUrl == null){
            canonicalUrl = this.attributes.get("do");
            this.isGo = false;
        }
        if(canonicalUrl == null){
            throw new InvalidTemplateError("<e:a> needs a go or action attribute", this);
        }
        if(!canonicalUrl.includes(".")){
            let templatePrefix = this.getTemplateName();
            templatePrefix = templatePrefix.substring(0, templatePrefix.lastIndexOf('.'));
            canonicalUrl = templatePrefix + "." + canonicalUrl;
        }
        canonicalUrl = canonicalUrl.substring(0, canonicalUrl.indexOf('('));
        //TODO let translateUrl = new TranslateFormat(canonicalUrl, this.getApplication().getRouteTranslator());
    }

    public render(engine: RenderEngine, request:Request, response: Response): void{
        //let url = translateUrl.format(response.getData(), response.getLocale());
        let url = ''; //engine.formatUrl(response);
        if(this.isGo){
            response.write("<a href=\"" + url + "\" onclick=\"Essentials.go(this)\">");
            super.render(engine, request, response);
            response.write("</a>");
        }else{
            response.write("<form class=\"e-action\" onsubmit=\"Essentials.do(this)\"><button>");
            super.render(engine, request, response);
            response.write("</button></form>");
        }
    }
}