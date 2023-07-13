import {Query, Connection, EntityAdapter, Entity } from "../index.js";

/**
 * Connects the whole model (all entities) to a given database.
 */
export abstract class ShemaAdapter<C extends Connection>{

    protected connection: C;

    constructor(connection: C){
        this.connection = connection;
    }

    public getConnection(): C{
        return this.connection;
    }

    //protected entityConnectorMap = new Map<typeof Entity, EntityConnector>;
    
    abstract create(entityConnector: EntityAdapter): void;

    abstract drop(entityConnector: EntityAdapter): void;

    abstract alter(entityConnector: EntityAdapter): void;

    query<E extends Entity>(entityType: new() => E): Query<E>{
        throw Error("Not Implemented");
    }
}