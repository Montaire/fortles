import { PoolOptions, Pool, createPool } from "mysql2/promise"
import { Driver, SchemaAdapter } from "@fortles/model";
import { MySqlSchemaAdapter } from "./adapter/MySqlSchemaAdapter.js";

export  class MySqlDriver extends Driver{

    protected override schemaAdapter = new MySqlSchemaAdapter(this);

    protected mySqlPromisePool: Pool;

    constructor(config: PoolOptions){
        super();
        this.mySqlPromisePool = createPool(config);
    }

    async execute(query: string, data: []|null = null): Promise<any>{
        return this.mySqlPromisePool.execute(query, data);
    }
}