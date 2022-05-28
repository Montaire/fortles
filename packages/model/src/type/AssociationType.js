import { Type } from "../index.js";
import TypeUtility from "./TypeUtility.js";
export class AssociationType extends Type {
    target;
    source;
    fieldName;
    constructor(target, source, fieldName, config) {
        super(config);
        this.target = target;
        this.source = source;
        this.fieldName = fieldName;
    }
    getTarget() {
        return this.target;
    }
    getFieldName() {
        return this.fieldName;
    }
    parse(input) {
        return null;
    }
}
export class OneAssociationType extends AssociationType {
}
export class ManyAssociationType extends AssociationType {
}
export class BelongsToAssociationType extends OneAssociationType {
}
export class BelongsToManyAssociationType extends OneAssociationType {
}
export class HasOneAssociationType extends OneAssociationType {
}
export class HasManyAssociationType extends OneAssociationType {
}
export function hasOne(targetType, config = {}) {
    return (target, propertyKey) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, this, propertyKey, config));
    };
}
export function hasMany(targetType, config = {}) {
    return (target, propertyKey) => {
        TypeUtility.setType(target, propertyKey, new HasManyAssociationType(targetType, this, propertyKey, config));
    };
}
export function belongsTo(targetType, config = {}) {
    return (target, propertyKey) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, this, propertyKey, config));
    };
}
//# sourceMappingURL=AssociationType.js.map