import { ModelChange, OrmQuery, Query } from "../index.js";

export abstract class Connection{
    public applyChange(change: ModelChange){

    }

    public createQuery<T>(entityType: new() => T): Query<T>{
        return new OrmQuery(entityType);
    }
}