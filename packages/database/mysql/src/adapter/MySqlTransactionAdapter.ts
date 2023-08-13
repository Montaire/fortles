import { TransactionAdapter } from "@fortles/model";
import { MySqlDriver } from "../MySqlDriver.js";
import { PoolConnection } from "mysql2/promise";

export class MySqlTransactionAdapter extends TransactionAdapter<PoolConnection>{
    
}