import { Request, Response } from "../../index.js";
import { RenderEngine } from "../../render/index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";
export default class AnchorControlShard extends ControlShard {
    protected action: string;
    initialize(reader: CharacterStreamReader): void;
    getName(): string;
    render(engine: RenderEngine, request: Request, response: Response): void;
}
