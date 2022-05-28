import { Type } from "./index.js";
export class IntegerType extends Type {
    parse(input, error) {
        let result = Number.parseInt(input);
        if (result == NaN) {
            if (input !== "") {
                error.invalid();
            }
            return null;
        }
        return result;
    }
    constructor(config = {}) {
        super(config);
        if (config.min) {
            this.addValidation(x => x >= config.min ? null : "Should not be less than " + config.min);
        }
        if (config.max) {
            this.addValidation(x => x <= config.max ? null : "Should not be greater than " + config.min);
        }
    }
}
export function integer(config) {
    return function (target, propertyKey) {
        target.constructor["typeMap"].set(propertyKey, new IntegerType(config));
    };
}
//# sourceMappingURL=IntegerType.js.map