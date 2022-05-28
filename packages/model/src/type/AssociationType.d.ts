import { Entity, EntityPropertyDecorator, Type } from "../index.js";
export declare type AssociationTypeConfig = {};
export declare class AssociationType<C extends AssociationTypeConfig> extends Type<Entity, C> {
    protected target: typeof Entity;
    protected source: typeof Entity;
    protected fieldName: string;
    constructor(target: typeof Entity, source: typeof Entity, fieldName: string, config: C);
    getTarget(): typeof Entity;
    getFieldName(): string;
    parse(input: string): Entity;
}
export declare class OneAssociationType<C> extends AssociationType<C> {
}
export declare class ManyAssociationType<C> extends AssociationType<C> {
}
export declare class BelongsToAssociationType extends OneAssociationType<AssociationTypeConfig> {
}
export declare class BelongsToManyAssociationType extends OneAssociationType<AssociationTypeConfig> {
}
export declare class HasOneAssociationType extends OneAssociationType<AssociationTypeConfig> {
}
export declare class HasManyAssociationType extends OneAssociationType<AssociationTypeConfig> {
}
export declare function hasOne(targetType: typeof Entity, config?: AssociationTypeConfig): EntityPropertyDecorator;
export declare function hasMany(targetType: typeof Entity, config?: AssociationTypeConfig): EntityPropertyDecorator;
export declare function belongsTo(targetType: typeof Entity, config?: AssociationTypeConfig): EntityPropertyDecorator;
