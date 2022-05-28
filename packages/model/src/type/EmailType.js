import { TypeUtility } from "./index.js";
import { StringType } from "./StringType.js";
export class EmailType extends StringType {
    parse(input, reporter) {
        return input;
    }
    constructor(config = { length: 80 }) {
        super({
            length: config.length,
            fixed: false
        });
    }
}
export function email(config) {
    return function (target, propertyKey) {
        TypeUtility.setType(target, propertyKey, new EmailType(config));
    };
}
//# sourceMappingURL=EmailType.js.map