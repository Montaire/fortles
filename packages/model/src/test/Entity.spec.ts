import { string, integer, primaryKey, generated, Entity } from "../index.js"

class TestEntity extends Entity{
    @primaryKey
    @generated
    @integer()
    public id: number = 0;

    @string()
    public name: string;
}

describe("Entity", function(){

    let entity: TestEntity = null;
    before("Create new Entity", function(){
        entity = new TestEntity();
    });

    it("Where processed correctly", function(){

    });
});