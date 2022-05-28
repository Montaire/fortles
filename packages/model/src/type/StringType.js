import { Type, TypeUtility } from "./index.js";
export class StringType extends Type {
    parse(input, reporter) {
        return input;
    }
    constructor(config = { length: 80 }) {
        super(config);
    }
}
export function string(config) {
    return function (target, propertyKey) {
        TypeUtility.setType(target, propertyKey, new StringType(config));
    };
}
//# sourceMappingURL=StringType.js.map