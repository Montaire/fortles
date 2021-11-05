import { RenderEngine } from "../../render/index.js";
import { ControlShard, TemplateShard, WriteableShard } from "../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import {Request, Response, InvalidTemplateError} from "../../index.js";

export default class FormatControlShard extends ControlShard{

    protected text: string;

    constructor(reader: CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "input");
        if(this.shards.length == 1 && this.shards[0] instanceof WriteableShard){
            let textShard = this.shards[0];
            this.text = textShard.toString();
            delete this.shards;
        }else{
            throw new InvalidTemplateError("A Format shard should contain only text", this);
        }
    }

    render(renderEngine: RenderEngine, request: Request, response: Response): void{
        response.write(this.text);
    }
}