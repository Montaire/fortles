import assert from "assert";
import { Connection, Model, ModelChange, ModelDescriptor } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { TestGroup } from "./model/TestGroup.js";
import { TestDriver, TestSchemaAdapter } from "./utility/TestDriver.js";

describe("Model", function(){
    describe("Migration", function(){
        let model: Model;
        let connection = new Connection(new TestDriver());
        this.beforeAll("Preapre Model", async function(){
            const modelDescriptor = await ModelDescriptor.create(['./packages/model/test/model']);
            model = new Model(modelDescriptor, new Map([["default", connection]]));

        });
        it("Model descriptor is correct", function(){
            const entityDescriptors = model.getModelDescriptor().getEntityDescriptors();
            assert(entityDescriptors.find(x => x.baseEntityType == TestGroup), "TestGroup is missing.");
            assert(entityDescriptors.find(x => x.baseEntityType == TestUser), "TestUser is missing.");
        });
        it("Creates new tables", function(){
            model.migrate();
            const schemaAdapter = connection.getDriver().getSchemaAdapter() as TestSchemaAdapter;
            assert.notEqual(schemaAdapter.altered.length, 0, "There should be changes.");
            
            const testGroupChange = schemaAdapter.altered[0];
            assert.equal(testGroupChange, TestGroup, 
                "TestGroup should be created first.");

            const testUserChange = schemaAdapter.altered[1];
            assert.equal(testUserChange, TestUser, 
                "TestUser should be created secondly.");

        });
    });
});