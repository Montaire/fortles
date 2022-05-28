/**
 * Simple shader, which meant to be built from the outside.
 */
export default class WriteableShard {
    /**
     * Write method will append to this.
     */
    content = '';
    /**
     * Appends text to the shard.
     */
    write(text) {
        this.content += text;
    }
    toString() {
        return this.content;
    }
    /**
     * Override if there is an action needed after the shader is built. Like
     * buffering the input. The {@link this.content} should be processed.
     */
    ready() {
    }
    /**
     * Checks if the current shard is empty.
     * If it is empty it can be skipped while rendering.
     * @returns
     */
    isEmpty() {
        return this.content.length == 0;
    }
    /**
     * @param engine
     * @param response
     */
    render(engine, request, response) {
        response.write(this.content);
    }
}
//# sourceMappingURL=WriteableShard.js.map