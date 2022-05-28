import { ControlShard } from "../index.js";
import { randomBytes } from 'crypto';
export default class AnchorControlShard extends ControlShard {
    action;
    initialize(reader) {
        this.action = this.attributes.get("action");
    }
    getName() {
        return "button";
    }
    render(engine, request, response) {
        let id = randomBytes(16);
        response.write("<button form=\"" + id + "\" " + this.rawAttributes + ">");
        super.render(engine, request, response);
        //Render the form
        response.write("<form id=\"" + id + "\"><input type=\"hidden\" name=\"fortlesAction\"> action=\"" + this.action + "\"");
        response.write("</form></button>");
    }
}
//# sourceMappingURL=ButtonControlShard.js.map