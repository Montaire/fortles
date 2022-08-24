import { Connection, Model } from "../src/index.js";

class TestConnection extends Connection{

}

describe("Model", function(){
    describe("Migration", function(){
        const model = new Model();
        this.beforeAll("Preapre Model", function(){
            model.getConnections().set("test", new TestConnection());
        });
        it("Can create new model", function(){
            model.migrate();
        });
    });
});