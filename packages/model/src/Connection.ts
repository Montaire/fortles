import { AlterSchemaChange, CreateSchemaChange, Driver, Entity, Query, SchemaAdapter, SchemaChange } from "./index.js";
import { DropSchemaChange } from "./schema/DropSchema.js";

export class Connection<D extends Driver = Driver>{

    protected driver: D;

    protected name: string;

    constructor(name: string, driver: D){
        this.name = name;
        this.driver = driver;
    }

    public getName(){
        return this.name;
    }

    public getSchema(): SchemaAdapter{
        return this.driver.getSchemaAdapter();
    }

    public query<E extends Entity>(entityType: new() => E): Query<E, this>{
        throw "changing";
    }

    public getDriver(): D{
        return this.driver;
    }

    public beginTransaction(): void{

    }

    public endTransaction(): void{

    }
}