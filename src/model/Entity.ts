import { Type } from "./index.js";

export default class Entity{

    protected static typeMap = new Map<string, Type<any>>();
    protected static primaryKeys: string[] = [];

    getPrimaryKey<T>(): T{
        return null;
    }
}