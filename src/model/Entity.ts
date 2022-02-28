import { Type } from "./index.js";

export default class Entity{

    static typeMap = new Map<string, Type<any, any>>();
    protected static primaryKeys: string[] = [];

    static getPrimaryKeys(): string[] | null{
        if(!this.primaryKeys.length){
            return null;
        }{
            return this.primaryKeys;
        }
    }

    static getType(name: string): Type<any, any>{
        return this.typeMap.get(name);
    }

    static hasType(name: string): boolean{
        return this.typeMap.has(name);
    }
}