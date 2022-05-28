import { RenderEngine } from "../../render/index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";
import { Request, Response } from "../../index.js";
export default class IfControlShard extends ControlShard {
    initialize(reader: CharacterStreamReader): void;
    getName(): string;
    render(engine: RenderEngine, request: Request, response: Response): void;
}
