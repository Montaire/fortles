import { Entity, Type } from "../index.js";
export default class EntityDescriptor {
    baseEntityType: typeof Entity;
    typeMap: Map<string, Type<any, any>>;
    constructor(entityType: typeof Entity);
    append(entityType: typeof Entity): void;
    static build(entityTypes: typeof Entity[]): EntityDescriptor[];
}
