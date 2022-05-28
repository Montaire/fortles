import { Response } from "./index.js";
export default class ChildResponse extends Response {
    parent;
    constructor(controller, parent) {
        super(controller);
        if (parent instanceof ChildResponse) {
            this.parent = parent.getParent();
        }
        else {
            this.parent = parent;
        }
    }
    write(content) {
        this.parent.write(content);
    }
    close() {
        this.parent.close();
    }
    getParent() {
        return this.parent;
    }
}
//# sourceMappingURL=ChildResponse.js.map