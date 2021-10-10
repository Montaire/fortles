/**
 * Simple shader, which meant to be bult from the outside.
 */
class WriteableShard extends Shard {

    /**
     * Write method will append to this.
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
}

module.exports = WriteableShard;