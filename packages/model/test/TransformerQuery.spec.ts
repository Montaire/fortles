import { OrmQuery, orm} from "../src/index.js"

class TestEntity{
    id = 5;
}

class TestController{
    @orm
    view(){
        let id = 5;
        let query = new OrmQuery<TestEntity>();
        query.where(x => x.id == id);
    }
}

describe("TransformerQuery", function(){
    it("Where processed correctly", function(){
        let controller = new TestController();
        controller.view();
    });
});