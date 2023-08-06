import {Query, Driver, EntityAdapter, Entity, SchemaChange, CreateSchemaChange } from "../index.js";
import { DropSchemaChange } from "../schema/DropSchema.js";
import { AlterSchema } from "./Schema.js";

/**
 * Connects the whole model (all entities) to a given database.
 * 
 * Concerned with DDL (Data Definition Language) operations such as 'CREATE DATABASE', 'DROP DATABASE', 'CREATE TABLE', 'DROP TABLE', etc.
 */
export abstract class SchemaAdapter<D extends Driver = Driver>{

    protected driver: D;

    constructor(driver: D){
        this.driver = driver;
    }

    public getDriver(): D{
        return this.driver;
    }
    
    abstract create(schema: CreateSchemaChange): Promise<void>;

    abstract drop(name: DropSchemaChange): Promise<void>;

    abstract alter(schema: AlterSchema): Promise<void>;
}