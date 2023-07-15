import assert from "assert";
import { string, integer, primaryKey, generated, Entity, connection, IntegerType, StringType, model } from "../src/index.js"
import { ExpressionTestConnection } from "./utility/ExpressionTestConnection.js";

@model
class TestEntity extends Entity{
    @primaryKey
    @generated
    @integer()
    public id: number = 0;

    @string()
    public name?: string;
}

describe("Entity", function(){

    it("Has coorect primary keys", function(){
        const modelInfo = TestEntity.getModelInfo();
        assert.deepStrictEqual(modelInfo.primaryKeys, ["id"], "Only [id] primary key should exist. It has [" + modelInfo.primaryKeys.toString() + "]");
    });

    it("Has correct types", function(){
        const modelInfo = TestEntity.getModelInfo();
        assert(modelInfo.typeMap.get("id") instanceof IntegerType, "Id should have an integer type. It has " + modelInfo.typeMap.get("id")?.constructor.name);
        assert(modelInfo.typeMap.get("name") instanceof StringType, "Name should have an integer type. It has " + modelInfo.typeMap.get("id")?.constructor.name);
    });
});