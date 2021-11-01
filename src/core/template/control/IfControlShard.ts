import RenderEngine from "essentials/src/core/render/RenderEngine";
import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import {ControlShard, TemplateShard} from "../";
import {Request, Response} from "essentials/src";

export default class IfControlShard extends ControlShard{
    constructor(reader : CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "if");
    }

    render(engine: RenderEngine, request: Request, response: Response){
        if(true){
            super.render(engine, request, response);
        }
    }
}