import TestRequest from "../../test-utility/TestRequest.js";
import { TranspilerQuery } from "../index.js"

class TestEntity{
    id = 5;
}

/*class QueryObjectProxy<T extends object> extends Proxy<T>{
    constructor(){
        let target: T = {};
        super(target, this);
    }
    handler = ProxyHandler<T>;
}*/

function deco(){

}

describe("TransformerQuery", function(){
    it("Where processed correctly", function(){
        let query = new TranspilerQuery<TestEntity>();
        var id = 5;
        query.where(x => x.id == id);

    });
});