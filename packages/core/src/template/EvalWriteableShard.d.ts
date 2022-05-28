import { RenderEngine } from "../render/index.js";
import { WriteableShard } from "./index.js";
import { Request, Response } from "../index.js";
export default class EvalWriteableShard extends WriteableShard {
    protected compiledScript: Function;
    protected fieldName: string;
    protected sourcePath: string;
    /**
     * Eval shard contains runnable javascript. It is possible to use return as well.
     * @param path The path of the template.
     * @param line Line number of the template
     */
    constructor(path: string);
    /**
     * Prepares the given script
     */
    ready(): void;
    render(engine: RenderEngine, request: Request, response: Response): void;
}
