import { SchemaAdapter } from "./index.js";

export abstract class Driver<Config = Record<string, any>>{

    protected abstract schemaAdapter: SchemaAdapter;

    public getSchemaAdapter(): SchemaAdapter{
        return this.schemaAdapter;
    }
}