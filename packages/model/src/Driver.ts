import { Connection, Entity, EntityAdapter, SchemaAdapter, TransactionAdapter } from "./index.js";

export abstract class Driver<Config = Record<string, any>>{

    protected abstract schemaAdapter: SchemaAdapter;

    protected abstract transactionAdapter: TransactionAdapter<this>;

    protected abstract entityAdapter: EntityAdapter;

    /**
     * Gives a unified interface 
     * @returns 
     */
    public getSchemaAdapter(): SchemaAdapter{
        return this.schemaAdapter;
    }

    public getTransactionAdapter(): TransactionAdapter<this>{
        return this.transactionAdapter;
    }

    /**
     * Creates a new connection.
     * All created connection should have a different session, 
     * so on concurrent enviroments, each execution should create a connection.
     */
    public abstract createConnection(): Connection<this>;
}