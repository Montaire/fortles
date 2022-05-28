import { ControlShard, WriteableShard } from "../index.js";
import { InvalidTemplateError } from "../../index.js";
export default class FormatControlShard extends ControlShard {
    constructor(reader, parent, started) {
        super(reader, parent, started);
    }
    text = "";
    initialize(reader) {
        if (this.shards.length == 1 && this.shards[0] instanceof WriteableShard) {
            let textShard = this.shards[0];
            this.text = textShard.toString();
            delete this.shards;
        }
        else {
            throw new InvalidTemplateError("A Format shard should contain only text", reader);
        }
    }
    getName() {
        return "f";
    }
    render(renderEngine, request, response) {
        response.write(this.text);
    }
}
//# sourceMappingURL=FormatControlShard.js.map