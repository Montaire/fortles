import { Entity, Query, Connection, EntityConnector } from "../index.js";

/**
 * Connects the whole model (all entities) to a given database.
 */
export abstract class ModelConnector<C extends Connection>{

    protected connection: C;

    constructor(connection: C){
        this.connection = connection;
    }

    public getConnection(): C{
        return this.connection;
    }

    //protected entityConnectorMap = new Map<typeof Entity, EntityConnector>;
    
    abstract create(entityConnector: EntityConnector): void;

    abstract drop(entityConnector: EntityConnector): void;

    abstract alter(entityConnector: EntityConnector): void;

    query<T>(entityType: new() => T): Query<T>{
        throw Error("Not Implemented");
    }
}