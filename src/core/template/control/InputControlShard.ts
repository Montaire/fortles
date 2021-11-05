import { InvalidTemplateError } from "../../Error";
import {CharacterStreamReader} from "../../utility";
import {ControlShard, TemplateShard} from "../index.js";
import {RenderEngine} from "../../render";
import {Request, Response} from "../../../";

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