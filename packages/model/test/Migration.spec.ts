import assert from "assert";
import { CreateSchemaChange, Model, ModelChange, ModelDescriptor, SchemaChange } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { TestGroup } from "./model/TestGroup.js";
import { TestDriver, TestSchemaAdapter } from "./utility/TestDriver.js";
import { CreateSchema } from "../src/schema/CreateSchema.js";

describe("Model", function(){

    this.beforeAll("Preapre connection", function(){
        Model.getInstance().setDriver(new TestDriver("default"));
    });

    describe("Migration", function(){
        this.beforeAll("Preapre Model", async function(){
            await Model.getInstance().getModelDescriptor().addFolder("./packages/model/test/model");
        });

        it("Model descriptor is correct", function(){
            const entityDescriptors = Model.getInstance().getModelDescriptor().getEntityDescriptors();
            assert(entityDescriptors.find(x => x.baseEntityType == TestGroup), "TestGroup is missing.");
            assert(entityDescriptors.find(x => x.baseEntityType == TestUser), "TestUser is missing.");
        });

        it("Has the correct changes", function(){
            const modelDescriptor = Model.getInstance().getModelDescriptor();
            const changesMap = modelDescriptor.getChanges(new ModelDescriptor());
            assert.equal(changesMap.get("default")?.length, 2, "There should be 2 changes");
            const changes = changesMap.get("default") as SchemaChange[];
            assert(changes[0] instanceof CreateSchemaChange, "We should have create change");
        });

        it("Runs migration, creates new tables", function(){
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