export default class TypeUtility {
    static setTypeProperty(target, name, propertyKey, propertyValue) {
        target.constructor["primaryKeys"].push(name);
        let type = target.constructor["typeMap"].get(name);
        if (!type) {
            throw new Error("'" + target.constructor.name + "' for '" + name + "' needs a type decorator at the last position.");
        }
        type.setProperty(propertyKey, propertyValue);
    }
    static setType(target, propertyKey, type) {
        target.constructor["typeMap"].set(propertyKey, type);
    }
}
//# sourceMappingURL=TypeUtility.js.map