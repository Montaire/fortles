import { TranspilerQuery, query} from "../index.js"

class TestEntity{
    id = 5;
}

class TestController{
    @query
    view(){
        let id = 5;
        let query = new TranspilerQuery<TestEntity>();
        query.where(x => x.id == id);
    }
}

describe("TransformerQuery", function(){
    it("Where processed correctly", function(){
        let controller = new TestController();
        console.log(controller.view);
        controller.view();
    });
});