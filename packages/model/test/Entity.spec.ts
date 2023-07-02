import assert from "assert";
import { string, integer, primaryKey, generated, Entity, connection, IntegerType, StringType } from "../src/index.js"
import { ExpressionTestConnection } from "./utility/ExpressionTestConnection.js";

@connection(new ExpressionTestConnection())
class TestEntity extends Entity{
    @integer()
    @primaryKey
    @generated
    public id: number = 0;

    @string()
    public name?: string;
}

describe("Entity", function(){
    let entity: TestEntity|null = null;
    before("Create new Entity", function(){
        //entity = new TestEntity();
    });

    it("Has correct types", function(){
        const modelInfo = TestEntity.getModelInfo();
        console.log(modelInfo.primaryKeys);
        assert(modelInfo.typeMap.get("id") instanceof IntegerType);
        assert(modelInfo.typeMap.get("name") instanceof StringType);
        assert.deepStrictEqual(modelInfo.primaryKeys, ["id"]);
    });
});