import { TypeUtility, StringType } from "./index.js";
import { randomUUID } from "crypto";
export class UuidType extends StringType {
    constructor(config = { generated: true }) {
        super({ fixed: true, length: 36 });
        let regexp = /([0-9a-f]{4}-?){4}/;
        this.addValidation(x => regexp.test(x) ? null : "");
    }
    generate() {
        return randomUUID();
    }
}
export function uuid(config) {
    return function (target, propertyKey) {
        TypeUtility.setType(target, propertyKey, new UuidType(config));
    };
}
//# sourceMappingURL=UuidType.js.map