import assert from "assert";
import { Connection, Model, ModelDescriptor } from "../src/index.js";

class TestConnection extends Connection{

}

describe("Model", function(){
    describe("Migration", function(){
        let model: Model;
        this.beforeAll("Preapre Model", async function(){
            const modelDescriptor = await ModelDescriptor.create(['./packages/model/test/model']);
            model = new Model(modelDescriptor);
            model.getConnections().set("test", new TestConnection());

        });
        it("Model is correct", function(){
            const entityDescriptors = model.getModelDescriptor().getEntityDescriptors();
            assert.equal(entityDescriptors.length, 2, "Model should have 2 entities.");
        });
        it("Can create new model", function(){
            model.migrate();
        });
    });
});