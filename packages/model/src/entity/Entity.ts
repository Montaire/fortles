import { Connection, Type } from "../index.js";

export class Entity{

    protected static typeMap = new Map<string, Type<any, any>>();
    protected static primaryKeys: string[] = [];
    protected static connection: Connection;

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

    static getTypeMap(): Readonly< Map<string, Type<any, any>>>{
        return this.typeMap;
    }
    
    static getConnection(): Connection{
        return this.connection;
    }
}