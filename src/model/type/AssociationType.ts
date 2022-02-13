import { Entity, EntityPropertyDecorator, Type } from "../index.js";
import TypeUtility from "./TypeUtility.js";

export type AssociationTypeConfig = {

};

export class AssociationType<C extends AssociationTypeConfig> extends Type<Entity, C>{

    protected target: typeof Entity;

    constructor(target: typeof Entity, config: C){
        super(config);
        this.target = target;
    }

    public getTarget(): typeof Entity{
        return this.target;
    }
}

export class OneAssociationType<C> extends AssociationType<C>{}

export class ManyAssociationType<C> extends AssociationType<C>{}

export class BelongsToAssociationType extends OneAssociationType<AssociationTypeConfig>{

}

export class HasOneAssociationType extends OneAssociationType<AssociationTypeConfig>{

}

export function hasOne(targetType: typeof Entity, config: AssociationTypeConfig = {}): EntityPropertyDecorator {
    return (target: Entity, propertyKey:string) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, config));
    }
}

export function belongsTo(targetType: typeof Entity, config: AssociationTypeConfig = {}): EntityPropertyDecorator {
    return (target: Entity, propertyKey:string) => {
        TypeUtility.setType(target, propertyKey, new HasOneAssociationType(targetType, config));
    }
}