import { Connection } from "@fortles/model";
import mysql, { Pool } from "mysql2";
import { Pool as PromisePool } from "mysql2/promise"

export default class MySqlConnection extends Connection{

    protected connection: PromisePool;

    constructor(config: mysql.PoolOptions){
        super();
        this.connection = mysql.createPool(config).promise();
    }

    async execute(query: string, data: [] = null): Promise<any>{
        return await this.connection.execute(query, data);
    }
}