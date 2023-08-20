import { Connection } from "../index.js";

export abstract class SchemaChange{
    protected name: string;

    constructor(name: string){
        this.name = name;
    }

    public getName(){
        return this.name;
    }

    public abstract applyTo(connection: Connection): Promise<void>;
    
}