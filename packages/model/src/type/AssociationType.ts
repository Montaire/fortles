import { Entity, EntityPropertyDecorator, Type } from "../index.js";
import TypeUtility from "./TypeUtility.js";

export type AssociationTypeConfig = {

};

export class AssociationType<C extends AssociationTypeConfig> extends Type<Entity, C>{

    protected target: typeof Entity;
    protected source: typeof Entity;
    protected fieldName: string;

    constructor(target: typeof Entity, source: typeof Entity, fieldName: string, config: C){
        super(config);
        this.target = target;
        this.source = source;
        this.fieldName = fieldName;
    }

    public getTarget(): typeof Entity{
        return this.target;
    }

    public getFieldName(): string{
        return this.fieldName;
    }

    public parse(input: string): Entity {
        return null;
    }
}

export class OneAssociationType<C> extends AssociationType<C>{}

export class ManyAssociationType<C> extends AssociationType<C>{}

export class BelongsToAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class BelongsToManyAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class HasOneAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class HasManyAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export function hasOne(targetType: typeof Entity, config: AssociationTypeConfig = {}): EntityPropertyDecorator {
    return (target: Entity, propertyKey:string) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, this, propertyKey, config));
    }
}

export function hasMany(targetType: typeof Entity, config: AssociationTypeConfig = {}): EntityPropertyDecorator {
    return (target: Entity, propertyKey:string) => {
        TypeUtility.setType(target, propertyKey, new HasManyAssociationType(targetType, this, propertyKey, config));
    }
}

export function belongsTo(targetType: typeof Entity, config: AssociationTypeConfig = {}): EntityPropertyDecorator {
    return (target: Entity, propertyKey:string) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, this, propertyKey, config));
    }
}