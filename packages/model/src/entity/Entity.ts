import { Connection, Query, Type, EntityModelInfo, AssociationType } from "../index.js";

export function connection(connection: Connection){
    return function(target: typeof Entity, context: ClassDecoratorContext): void{
        if(!target.hasModelInfo()){
            throw Error("@model decorator should be present after @connection.");
        }
        target.getModelInfo().connection = connection;
    };
}

/** 
 * Temproary hack to solve the lack of metadata in the current implementation of decorators.
 */
export function model(target: typeof Entity, context: ClassDecoratorContext){
    if(EntityModelInfo.temporary){
        target.setModelInfo(EntityModelInfo.temporary);
        EntityModelInfo.temporary = null;
    }
    for(const type of target.getModelInfo().typeMap.values()){
        if(type instanceof AssociationType){
            type.setSource(target);
        }
    }
}

export class Entity{

    protected static modelInfoMap = new Map<typeof Entity, EntityModelInfo>();

    static getModelInfo(): EntityModelInfo{
        if(!this.modelInfoMap.has(this)){
            this.modelInfoMap.set(this, new EntityModelInfo());
        }
        return this.modelInfoMap.get(this) as EntityModelInfo;
    }

    static hasModelInfo(): boolean{
        return this.modelInfoMap.has(this);
    }

    static setModelInfo(modelInfo: EntityModelInfo){
        this.modelInfoMap.set(this, modelInfo);
    }

    static getPrimaryKeys(): string[] | null{
        if(!this.getModelInfo().primaryKeys.length){
            return null;
        }{
            return this.getModelInfo().primaryKeys;
        }
    }

    static getType(name: string): Type<any, any> | null{
        return this.getModelInfo().typeMap.get(name) ?? null;
    }

    static hasType(name: string): boolean{
        return !!(this.getModelInfo().typeMap.has(name));
    }

    static getTypeMap(): Readonly< Map<string, Type<any, any>>>{
        return this.getModelInfo().typeMap;
    }
    
    static getConnection(): Connection | null{
        return this.getModelInfo().connection ?? null;
    }

    static query<T extends Entity>(this: {new(): T}): Query<T> {
        const connection = (this as unknown as typeof Entity).getConnection();
        if(!connection){
            throw new Error(this.name + " has no default connection!");
        }
        return connection.createQuery(this);
    }
}