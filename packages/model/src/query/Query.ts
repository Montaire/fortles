import { Connection, Entity, TransactionAdapter } from "../index.js";

export class Query<E extends Entity, C extends Connection = Connection> implements Iterable<E>{

    protected entityType: new() => E;
    protected queryAdapter: TransactionAdapter<C>

    constructor(entityType: new() => E, queryAdapter: TransactionAdapter<C>){
        this.entityType = entityType;
        this.queryAdapter = queryAdapter;
    }

    [Symbol.iterator](): Iterator<E, any, undefined>{
        throw "Not implemented";
    }

    where(condition: (item: E) => boolean): this{

        return this;
    }

    first(condition?: (item: E) => boolean): E|null{
        if(condition){
            this.where(condition);
        }
        for(let item of this){
            return item;
        }
        return null;
    }

    orderBy(field: (item:E) => any): this{
        return this;
    }
    
    
}