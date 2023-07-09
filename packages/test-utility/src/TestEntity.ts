import { Entity, primaryKey, generated, integer, string, model } from "@fortles/model";

@model
export default class TestEntity extends Entity{
    @primaryKey
    @generated
    @integer()
    public id: number = 0;

    @string()
    public name?: string;
}