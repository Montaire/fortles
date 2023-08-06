import assert from "assert";
import { Model } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { TestGroup } from "./model/TestGroup.js";
import { TestSchemaAdapter } from "./utility/TestDriver.js";

describe("Model", function(){
    describe("Migration", function(){
        this.beforeAll("Preapre Model", async function(){
            await Model.getInstance().getModelDescriptor().addFolder("./packages/model/test/model");

        });
        it("Model descriptor is correct", function(){
            const entityDescriptors = Model.getInstance().getModelDescriptor().getEntityDescriptors();
            assert(entityDescriptors.find(x => x.baseEntityType == TestGroup), "TestGroup is missing.");
            assert(entityDescriptors.find(x => x.baseEntityType == TestUser), "TestUser is missing.");
        });
        it("Creates new tables", function(){
            Model.getInstance().migrate();
            const schemaAdapter = Model.getConnection().getSchema() as TestSchemaAdapter;
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