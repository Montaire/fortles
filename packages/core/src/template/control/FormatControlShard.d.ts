import { RenderEngine } from "../../render/index.js";
import { ControlShard, TemplateShard, ControlShardCursorPosition } from "../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { Request, Response } from "../../index.js";
export default class FormatControlShard extends ControlShard {
    constructor(reader: CharacterStreamReader, parent: TemplateShard, started: ControlShardCursorPosition);
    protected text: string;
    initialize(reader: CharacterStreamReader): void;
    getName(): string;
    render(renderEngine: RenderEngine, request: Request, response: Response): void;
}
