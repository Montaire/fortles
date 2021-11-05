import { InvalidTemplateError } from "../../Error.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard, TemplateShard } from "../index.js";
import { RenderEngine } from "../../render/index.js";
import { Request, Response } from "../../index.js";

export default class InputControlShard extends ControlShard {
    constructor(reader: CharacterStreamReader, parent: TemplateShard){
        super(reader, parent, "input");
        if(this.shards.length > 0){
            throw new InvalidTemplateError("e:input cant have inner html.", this);
        }
    }

    render(engine: RenderEngine, request:Request, response:Response): void {
        response.write(`<input name=${this.attributes.get("name")} />`);
    }
}