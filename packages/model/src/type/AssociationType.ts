import { Entity, EntityFieldDecorator, Type, TypeUtility } from "../index.js";
import { ClassSerializer, ExportedData } from "../utlity/ClassSerializer.js";

export type AssociationTypeConfig = {

};

export class AssociationType<C extends AssociationTypeConfig> extends Type<Entity, C>{

    protected target: () => typeof Entity;
    protected source: typeof Entity;

    constructor(target: () => typeof Entity, source: typeof Entity, name: string | symbol, config: C){
        super(name, config);
        this.target = target;
        this.source = source;
    }

    public getSource(): typeof Entity{
        return this.source;
    }

    public setSource(source: typeof Entity){
        this.source = source;
    }

    /**
     * Gets the target type (other site) of the association
     * @returns The Type of the target.
     */
    public getTarget(): typeof Entity{
        return this.target();
    }

    public parse(input: string): Entity|null {
        return null;
    }

    public override import(source: ExportedData): void {
        super.import(source);
        this.source = ClassSerializer.getConstructor(source.source) as typeof Entity;
        this.target = () => ClassSerializer.getConstructor(source.target) as typeof Entity;
    }

    public override export(): ExportedData {
        const data = super.export();
        data.source = this.source.name;
        data.target = this.target().name;
        return data;
    }
}

export class OneAssociationType<C extends AssociationTypeConfig> extends AssociationType<C>{}

export class ManyAssociationType<C extends AssociationTypeConfig> extends AssociationType<C>{}

export class WithOneAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class WithManyAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class HasOneAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export class HasManyAssociationType extends OneAssociationType<AssociationTypeConfig>{}

export function hasOne(targetType: () => typeof Entity, config: AssociationTypeConfig = {}): EntityFieldDecorator {
    return (value: Entity, context: ClassFieldDecoratorContext) => {
        TypeUtility.setType(null, context.name, new HasOneAssociationType(targetType, Entity, context.name, config));
    }
}

export function hasMany(targetType: () => typeof Entity, config: AssociationTypeConfig = {}): EntityFieldDecorator {
    return (value: Entity, context: ClassFieldDecoratorContext) => {
        TypeUtility.setType(null, context.name, () => new HasManyAssociationType(targetType, Entity, context.name, config));
    }
}

export function withOne(targetType: () => typeof Entity, config: AssociationTypeConfig = {}): EntityFieldDecorator {
    return (value: Entity, context: ClassFieldDecoratorContext) => {
        TypeUtility.setType(null, context.name, () => new WithOneAssociationType(targetType, Entity, context.name, config));
    }
}

export function withMany(targetType: () => typeof Entity, config: AssociationTypeConfig = {}): EntityFieldDecorator {
    return (value: Entity, context: ClassFieldDecoratorContext) => {
        TypeUtility.setType(null, context.name, () => new WithManyAssociationType(targetType, Entity, context.name, config));
    }
}