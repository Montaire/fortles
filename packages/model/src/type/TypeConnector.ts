import { Type } from "./index.js";

export abstract class TypeConnector<T extends Type<D,any>, D, R>{

    constructor(protected type: T){

    }

    abstract exportData(value: D): R;

    abstract importData(value: R): D;

    abstract exportDefiniton(): string;

    abstract importDefinition(definition: string): T;
}