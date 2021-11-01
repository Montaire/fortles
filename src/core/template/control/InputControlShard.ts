import { InvalidTemplateError } from "essentials/src/core/Error";
import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import {ControlShard, TemplateShard} from "../index.js";
import RenderEngine from "essentials/src/core/render/RenderEngine";
import {Request, Response} from "essentials/src";

export default class InputControlShard extends ControlShard {
    constructor(reader: CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "input");
        if(this.shards.length > 0){
            throw new InvalidTemplateError("e:input cant have inner html.");
        }
    }

    render(engine: RenderEngine, request:Request, response:Response): void {
        response.write(`<input name=${this.attributes.get("name")} />`);
    }
}