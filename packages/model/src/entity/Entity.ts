import { Connection, Type } from "../index.js";
import { EntityModelInfo } from "./EntityModelInfo.js";

export class Entity{

    protected static modelInfoMap = new Map<string, EntityModelInfo>();

    static getModelInfo(): EntityModelInfo{
        if(!this.modelInfoMap.has(this.name)){
            this.modelInfoMap.set(this.name, new EntityModelInfo());
        }
        return this.modelInfoMap.get(this.name);
    }

    static getPrimaryKeys(): string[] | null{
        if(!this.getModelInfo().primaryKeys.length){
            return null;
        }{
            return this.getModelInfo().primaryKeys;
        }
    }

    static getType(name: string): Type<any, any>{
        return this.getModelInfo().typeMap.get(name);
    }

    static hasType(name: string): boolean{
        return !!(this.getModelInfo().typeMap.has(name));
    }

    static getTypeMap(): Readonly< Map<string, Type<any, any>>>{
        return this.getModelInfo().typeMap;
    }
    
    static getConnection(): Connection{
        return this.getModelInfo().connection;
    }
}