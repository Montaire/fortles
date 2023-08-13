import {Query, Driver, EntityAdapter, Entity, SchemaChange, CreateSchemaChange } from "../index.js";
import { DropSchemaChange } from "../schema/DropSchema.js";
import { AlterSchema } from "./Schema.js";

/**
 * Connects the whole model (all entities) to a given database.
 * 
 * Concerned with DDL (Data Definition Language) operations such as 'CREATE DATABASE', 'DROP DATABASE', 'CREATE TABLE', 'DROP TABLE', etc.
 */
export abstract class SchemaAdapter<NativeConnection>{

    protected nativeConnection: NativeConnection;

    constructor(nativeConnection: NativeConnection){
        this.nativeConnection = nativeConnection;
    }

    abstract create(schema: CreateSchemaChange): Promise<void>;

    abstract drop(name: DropSchemaChange): Promise<void>;

    abstract alter(schema: AlterSchema): Promise<void>;
}