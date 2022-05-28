import { Connection } from "@fortles/model";
import mysql from "mysql2";
import { Pool as PromisePool } from "mysql2/promise";
export default class MySqlConnection extends Connection {
    protected connection: PromisePool;
    constructor(config: mysql.PoolOptions);
    execute(query: string, data?: []): Promise<any>;
}
