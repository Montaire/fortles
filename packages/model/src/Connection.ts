import { Driver, Entity, EntityAdapter, Query, SchemaAdapter, TransactionAdapter } from "./index.js";

export class Connection<NativeConnection = any, D extends Driver<NativeConnection> = Driver<NativeConnection>>{

    protected driver: D;
    protected schemaAdapter: SchemaAdapter<NativeConnection>;
    protected transactionAdapter: TransactionAdapter<NativeConnection>;
    protected entityAdapter: EntityAdapter;
    protected nativeConnection: NativeConnection;

    constructor(
        driver: D,
        nativeConnection: NativeConnection,
        schemaAdapter: SchemaAdapter<NativeConnection>, 
        transactionAdapter: TransactionAdapter<NativeConnection>, 
        entityAdapter: EntityAdapter
    ){
        this.driver = driver;
        this.nativeConnection = nativeConnection;
        this.schemaAdapter = schemaAdapter;
        this.transactionAdapter = transactionAdapter;
        this.entityAdapter = entityAdapter;
    }

    public getSchema(): SchemaAdapter<NativeConnection>{
        return this.schemaAdapter;
    }

    public query<E extends Entity>(entityType: new() => E): Query<E, D>{
        return this.transactionAdapter.createQuery(entityType) as Query<E, D>;
    }

    public getDriver(): D{
        return this.driver;
    }

    public getNativeConnection(): NativeConnection{
        return this.nativeConnection;
    }

    public beginTransaction(): void{
        this.transactionAdapter.beginTransaction();
    }

    public endTransaction(): void{
        this.transactionAdapter.endTransaction();
    }
}