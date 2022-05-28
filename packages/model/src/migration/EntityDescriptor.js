export default class EntityDescriptor {
    baseEntityType;
    typeMap;
    constructor(entityType) {
        this.typeMap = new Map(entityType.getTypeMap());
    }
    append(entityType) {
        for (const [name, type] of entityType.getTypeMap()) {
            if (this.typeMap.has(name)) {
                if (this.typeMap.get(name) !== type) {
                    throw new Error("Field '" + name + "' on '" + entityType.name + "' tries to overwrite '" + this.baseEntityType.name + "'");
                }
            }
            else {
                this.typeMap.set(name, type);
            }
        }
        if (entityType instanceof this.baseEntityType) {
            this.baseEntityType = entityType;
        }
    }
    static build(entityTypes) {
        let descriptors = [];
        for (const entityType of entityTypes) {
            for (const descriptor of descriptors) {
                if (entityType instanceof descriptor.baseEntityType) {
                    descriptor.append(entityType);
                    break;
                }
            }
            descriptors.push(new EntityDescriptor(entityType));
        }
        return descriptors;
    }
}
//# sourceMappingURL=EntityDescriptor.js.map