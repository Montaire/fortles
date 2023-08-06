import { Driver, Entity, Query } from "../index.js";

/**
 *  Handles DML (Data Manipulation Language) operations and transactions,
 * which include CRUD operations (like 'INSERT', 'UPDATE', 'DELETE')
 * as well as transaction control commands like 'START TRANSACTION',
 * 'COMMIT', 'ROLLBACK', etc.
 */
export abstract class TransactionAdapter<D extends Driver>{

    protected driver: D;

    constructor(driver: D){
        this.driver = driver;
    }

    public createQuery<E extends Entity>(entityType: new() => E): Query<E, D>{
        throw "Not implemented";
    }

    public beginTransaction(): void{

    }

    public endTransaction(): void{

    }
}