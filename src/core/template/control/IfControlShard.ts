import {RenderEngine} from "../../render/index.js";
import {CharacterStreamReader} from "../../utility/index.js";
import {ControlShard, TemplateShard} from "../index.js";
import {Request, Response} from "../../index.js";

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