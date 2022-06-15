import { Type } from "./index.js";

export abstract class TypeConnector<T extends Type<D,any>, D>{

    constructor(protected type: T){

    }

    abstract exportData(value: D): any;

    abstract importData(): D;

    abstract exportDefiniton(): string;

    abstract importDefinition(): T;
}