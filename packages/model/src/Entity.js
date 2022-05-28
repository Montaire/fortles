export default class Entity {
    static typeMap = new Map();
    static primaryKeys = [];
    static getPrimaryKeys() {
        if (!this.primaryKeys.length) {
            return null;
        }
        {
            return this.primaryKeys;
        }
    }
    static getType(name) {
        return this.typeMap.get(name);
    }
    static hasType(name) {
        return this.typeMap.has(name);
    }
    static getTypeMap() {
        return this.typeMap;
    }
}
//# sourceMappingURL=Entity.js.map