import { Connection, Entity, EntityAdapter, SchemaAdapter, TransactionAdapter } from "./index.js";

export type ExtractNativeConnection<D> = D extends Driver<infer NativeConnection> ? NativeConnection : never;

export abstract class Driver<NativeConnection = any, Config = Record<string, any>>{

    protected name: string;

    constructor(name: string = "default"){
        this.name = name;
    }

    public getName(): string{
        return this.name;
    }
    /**
     * Creates a new connection.
     * All created connection should have a different session, 
     * so on concurrent enviroments, each execution should create a connection.
     */
    public abstract createConnection(): Promise<Connection>;
}