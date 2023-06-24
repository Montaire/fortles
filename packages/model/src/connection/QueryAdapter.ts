import { Connection, Entity, Query } from "../index.js";

export abstract class QueryAdapter<C extends Connection>{

    protected connection: C;

    constructor(connection: C){
        this.connection = connection;
    }

    public createQuery<E extends Entity>(entityType: new() => E): Query<E>{
        throw "Not implemented";
    }
}