import { TemplateShard } from "./index.js";
export default class Template extends TemplateShard {
    name;
    path;
    constructor(reader, name = null, path = null) {
        super(null);
        this.name = name;
        this.path = path;
        this.prepare(reader);
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=Template.js.map