import { Type } from "./index.js";
export default class Entity {
    static typeMap: Map<string, Type<any, any>>;
    protected static primaryKeys: string[];
    static getPrimaryKeys(): string[] | null;
    static getType(name: string): Type<any, any>;
    static hasType(name: string): boolean;
    static getTypeMap(): Readonly<Map<string, Type<any, any>>>;
}
