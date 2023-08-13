import { PoolOptions, Pool, createPool, PoolConnection } from "mysql2/promise"
import { Connection, Driver, EntityAdapter, SchemaAdapter, TransactionAdapter } from "@fortles/model";
import { MySqlSchemaAdapter, MySqlTransactionAdapter, MySqlEntityAdatper } from "./adapter/index.js";

export class MySqlDriver extends Driver<PoolConnection>{

    protected mySqlPromisePool: Pool;

    constructor(name: string, config: PoolOptions){
        super(name);
        this.mySqlPromisePool = createPool(config);
    }

    public override async createConnection(): Promise<Connection<PoolConnection, MySqlDriver>> {
        const mysqlConnection = await  this.mySqlPromisePool.getConnection();
        const connection = new Connection(
            this,
            mysqlConnection,
            new MySqlSchemaAdapter(mysqlConnection),
            new MySqlTransactionAdapter(mysqlConnection),
            new MySqlEntityAdatper()
        );
        return connection;
    }
}