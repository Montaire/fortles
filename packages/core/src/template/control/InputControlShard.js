import { InvalidTemplateError } from "../../Error.js";
import { ControlShard } from "../index.js";
export default class InputControlShard extends ControlShard {
    initialize(reader) {
        if (this.shards.length > 0) {
            throw new InvalidTemplateError("e:input cant have inner html.", reader);
        }
    }
    getName() {
        return "input";
    }
    render(engine, request, response) {
        response.write(`<input name=${this.attributes.get("name")} />`);
    }
}
//# sourceMappingURL=InputControlShard.js.map