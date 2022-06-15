import { InvalidTemplateError } from "../../Error.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard, TemplateShard } from "../index.js";
import { RenderEngine } from "../../render/index.js";
import { Request, Response } from "../../index.js";

export default class InputControlShard extends ControlShard {
    public initialize(reader: CharacterStreamReader): void {
        if(this.shards.length > 0){
            throw new InvalidTemplateError("e:input cant have inner html.", reader);
        }
    }
    public getName(): string {
        return "input";
    }

    override render(engine: RenderEngine, request:Request, response:Response): void {
        response.write(`<input name=${this.attributes.get("name")} />`);
    }
}