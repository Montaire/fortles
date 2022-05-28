import { ControlShard } from "../index.js";
export default class IfControlShard extends ControlShard {
    initialize(reader) {
    }
    getName() {
        return "if";
    }
    render(engine, request, response) {
        if (true) {
            super.render(engine, request, response);
        }
    }
}
//# sourceMappingURL=IfControlShard.js.map