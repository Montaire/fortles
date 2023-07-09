import assert from "assert";
import { Connection, Model, ModelChange, ModelDescriptor } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { TestGroup } from "./model/TestGroup.js";

class TestConnection extends Connection{
    public changes: ModelChange[] = [];
    public override applyChange(change: ModelChange): void {
        this.changes.push(change);
    }
}

describe("Model", function(){
    describe("Migration", function(){
        let model: Model;
        let connection: TestConnection;
        this.beforeAll("Preapre Model", async function(){
            model = new Model();
            const modelDescriptor = await ModelDescriptor.create(['./packages/model/test/model']);
            connection = new TestConnection();
            model.getConnections().set("test", connection);

        });
        it("Model descriptor is correct", function(){
            const entityDescriptors = model.getModelDescriptor().getEntityDescriptors();
            assert(entityDescriptors.find(x => x.baseEntityType == TestGroup), "TestGroup is missing.");
            assert(entityDescriptors.find(x => x.baseEntityType == TestUser), "TestUser is missing.");
        });
        it("Creates new model", function(){
            model.migrate();
            assert.notEqual(connection.changes.length, 0, "There should be changes.");
            
            const testGroupChange = connection.changes[0];
            assert.equal(testGroupChange.getEntityDescriptor().baseEntityType, TestGroup, 
                "TestGroup should be created first.");

            const testUserChange = connection.changes[0];
            assert.equal(testUserChange.getEntityDescriptor().baseEntityType, TestUser, 
                "TestUser should be created secondly.");

        });
    });
});