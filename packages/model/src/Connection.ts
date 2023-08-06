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

    public query<E extends Entity>(entityType: new() => E): Query<E, D>{
        return this.getDriver().getTransactionAdapter().createQuery(entityType);
    }

    public getDriver(): D{
        return this.driver;
    }

    public beginTransaction(): void{
        this.getDriver().getTransactionAdapter().beginTransaction();
    }

    public endTransaction(): void{
        this.getDriver().getTransactionAdapter().endTransaction();
    }
}