import { WriteableShard } from "./index.js";
import { RuntimeError } from "../index.js";
export default class EvalWriteableShard extends WriteableShard {
    compiledScript = null;
    fieldName = null;
    sourcePath;
    /**
     * Eval shard contains runnable javascript. It is possible to use return as well.
     * @param path The path of the template.
     * @param line Line number of the template
     */
    constructor(path) {
        super();
        this.sourcePath = path;
    }
    /**
     * Prepares the given script
     */
    ready() {
        if (this.content.length == 0) {
            return;
        }
        try {
            if (this.content.match("^[a-zA-Z0-9\\.]+$")) {
                this.fieldName = this.content;
            }
            else if (this.content.includes('return')) {
                this.compiledScript = new Function(this.content);
            }
            else {
                this.compiledScript = new Function('return ' + this.content);
            }
        }
        catch (error) {
            throw new RuntimeError("Eval shard '" + this.sourcePath + "' has error: " + error);
        }
    }
    render(engine, request, response) {
        if (this.fieldName != null) {
            let data = response.getData()[this.fieldName];
            if (data) {
                response.write(data);
            }
        }
        else {
            response.write(this.compiledScript.call(response.getData()));
        }
    }
}
//# sourceMappingURL=EvalWriteableShard.js.map