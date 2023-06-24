import { Entity, ModelChange, Query, QueryAdapter } from "../index.js";

export abstract class Connection{

    protected queryAdapter!: QueryAdapter<this>;

    public applyChange(change: ModelChange){

    }

    public createQuery<E extends Entity>(entityType: new() => E): Query<E, this>{
        return new Query<E, this>(entityType, this.getQueryAdapter());
    }

    public getQueryAdapter(){
        return this.queryAdapter;
    }
}