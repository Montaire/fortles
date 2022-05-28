import { Response, Request } from "../../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";
import { TemplateRenderEngine } from "../../render/index.js";
export default class BlockControlShard extends ControlShard {
    /** Name of the current block */
    protected name: string;
    protected openingTag: string;
    initialize(reader: CharacterStreamReader): void;
    /**
     * @returns Name of the Shard
     */
    getName(): string;
    render(engine: TemplateRenderEngine, request: Request, response: Response): void;
}
