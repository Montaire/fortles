import { Connection } from "../index.js";

export abstract class SchemaChange{
    protected name: string;
    protected reversed: SchemaChange|null = null;

    constructor(name: string){
        this.name = name;
    }

    public getName(){
        return this.name;
    }

    public abstract applyTo(connection: Connection): Promise<void>;
    
    public getReversed(): SchemaChange|null{
        return this.reversed;
    }
}