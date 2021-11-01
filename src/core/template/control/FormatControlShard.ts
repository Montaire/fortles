import { InvalidTemplateError } from "essentials/src/core/Error";
import RenderEngine from "essentials/src/core/render/RenderEngine";
import { ControlShard, TemplateShard, WriteableShard } from "essentials/src/core/template";
import CharacterStreamReader from "../../utility/CharacterStreamReader";
import {Request, Response} from 'essentials/src';

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