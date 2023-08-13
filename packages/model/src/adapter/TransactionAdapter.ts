import { Driver, Entity, Query } from "../index.js";

/**
 *  Handles DML (Data Manipulation Language) operations and transactions,
 * which include CRUD operations (like 'INSERT', 'UPDATE', 'DELETE')
 * as well as transaction control commands like 'START TRANSACTION',
 * 'COMMIT', 'ROLLBACK', etc.
 */
export abstract class TransactionAdapter<NativeConnection>{

    protected nativeConnection: NativeConnection;

    constructor(nativeConnection: NativeConnection){
        this.nativeConnection = nativeConnection;
    }

    public createQuery<E extends Entity>(entityType: new() => E): Query<E>{
        throw "Not implemented";
    }

    public beginTransaction(): void{

    }

    public endTransaction(): void{

    }
}