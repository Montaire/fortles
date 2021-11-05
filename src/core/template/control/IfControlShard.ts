import {RenderEngine} from "../../render";
import {CharacterStreamReader} from "../../utility";
import {ControlShard, TemplateShard} from "../";
import {Request, Response} from "../../../";

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