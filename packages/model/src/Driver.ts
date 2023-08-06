import { Connection, SchemaAdapter } from "./index.js";

export abstract class Driver<Config = Record<string, any>>{

    protected abstract schemaAdapter: SchemaAdapter;

    /**
     * Gives a unified interface 
     * @returns 
     */
    public getSchemaAdapter(): SchemaAdapter{
        return this.schemaAdapter;
    }

    /**
     * Creates a new connection.
     * All created connection should have a different session, 
     * so on concurrent enviroments, each execution should create a connection.
     */
    public abstract createConnection(): Connection<this>;
}