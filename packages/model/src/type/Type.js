import { TypeUtility } from "../index.js";
/**
 * - Validation
 * - Conversion (serialization, deserialization, sql->extendable)
 * - Formatting
 */
export class Type {
    propertyMap = new Map();
    validations = [];
    config;
    constructor(config) {
        this.config = config;
    }
    setProperty(name, value = null) {
        this.propertyMap.set(name, value);
    }
    getProperty(name) {
        return this.propertyMap.get(name);
    }
    getConfig() {
        return this.config;
    }
    hasProperty(name) {
        return this.propertyMap.has(name);
    }
    /**
     * Adds a validation
     * @param validation A validation is a callable, that should return null on success, the error message on fail.
     */
    addValidation(validation) {
        this.validations.push(validation);
    }
    /**
     * Validates a property with the given rules.
     * validation happens after parsing to the target type.
     * @param value Value to valudate
     * @returns Array of the errors
     */
    validate(value) {
        let errors = [];
        for (let validation of this.validations) {
            let result = validation(value);
            if (result != null) {
                errors.push(result);
            }
        }
        return errors;
    }
}
export var TypeProperty;
(function (TypeProperty) {
    TypeProperty["PRIMARY_KEY"] = "primaryKey";
    TypeProperty["GENERATED"] = "generated";
    TypeProperty["HAS_ONE"] = "hasOne";
    TypeProperty["HAS_MANY"] = "hasMany";
    TypeProperty["BELONGS_TO"] = "belongsTo";
    TypeProperty["BELONGS_TO_MANY"] = "belongsToMany";
    TypeProperty["NULLABLE"] = "nullable";
})(TypeProperty || (TypeProperty = {}));
export function readonly(target, propertyKey, descriptor) {
    descriptor.writable = false;
    return descriptor;
}
export function primaryKey(target, propertyKey) {
    TypeUtility.setTypeProperty(target, propertyKey, TypeProperty.PRIMARY_KEY);
}
export function generated(target, propertyKey) {
    TypeUtility.setTypeProperty(target, propertyKey, TypeProperty.GENERATED);
}
export function nullable(target, propertyKey) {
    TypeUtility.setTypeProperty(target, propertyKey, TypeProperty.NULLABLE);
}
//# sourceMappingURL=Type.js.map