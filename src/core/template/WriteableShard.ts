import Shard from "./Shard";
import RenderEngine from "../render/RenderEngine";
import { Request, Response } from "../../../";
/**
 * Simple shader, which meant to be built from the outside.
 */
export default class WriteableShard implements Shard {

    /**
     * Write method will append to this.
     * @type {string}
     */
    content = '';

    /**
     * Appends text to the shard.
     *
     * @param {string} text
     */
    write(text) {
        this.content += text;
    }

    toString() {
        return this.content;
    }

    /**
     * Override if there is an action needed after the shader is built. Like
     * buffering the input. The {@link #content} should be processed.
     */
    ready() {

    }

    /**
     * Checks if the current shard is empty. 
     * If it is empty it can be skipped while rendering.
     * @returns {boolean}
     */
    isEmpty() {
        return this.content.length == 0;
    }

    /**
     * @param engine 
     * @param response 
     */
     render(engine: RenderEngine, request: Request, response: Response) {
        response.write(this.content);
    }
}