import { Shard } from "./index.js";
import { RenderEngine } from "../render/index.js";
import { Request, Response } from "../index.js";
/**
 * Simple shader, which meant to be built from the outside.
 */
export default class WriteableShard implements Shard {
    /**
     * Write method will append to this.
     */
    protected content: string;
    /**
     * Appends text to the shard.
     */
    write(text: string): void;
    toString(): string;
    /**
     * Override if there is an action needed after the shader is built. Like
     * buffering the input. The {@link this.content} should be processed.
     */
    ready(): void;
    /**
     * Checks if the current shard is empty.
     * If it is empty it can be skipped while rendering.
     * @returns
     */
    isEmpty(): boolean;
    /**
     * @param engine
     * @param response
     */
    render(engine: RenderEngine, request: Request, response: Response): void;
}
