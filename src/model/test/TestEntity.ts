import { Entity, primaryKey, generated, integer, string } from "../index.js";

export class TestEntity extends Entity{
    @primaryKey
    @generated
    @integer()
    public id: number = 0;

    @string()
    public name: string;
}