import { Connection, Type } from "../index.js";

export class EntityModelInfo{
    public typeMap = new Map<string, Type<any, any>>();
    public primaryKeys: string[] = [];
    public connection!: Connection;
}