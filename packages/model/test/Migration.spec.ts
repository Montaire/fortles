import assert from "assert";
import { CreateSchemaChange, Model, ModelDescriptor, SchemaChange } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { TestGroup } from "./model/TestGroup.js";
import { TestDriver, TestSchemaAdapter } from "./utility/TestDriver.js";
import DatabseVersion from "../src/migration/model/DatabaseVersion.js";

describe("Model", function(){

    this.beforeAll("Preapre connection", function(){
        Model.getInstance().setDriver(new TestDriver("default"));
    });

    describe("Migration", function(){
        this.beforeAll("Preapre Model", async function(){
            await Model.getInstance().getModelDescriptor().addFolder("./packages/model/test/model");
        });

        it("Has correct descriptors", function(){
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

        it("Can save the migration", function(){
            Model.getInstance().getMigrationRunner();
        });

        it("Runs migration, creates new tables", function(){
            Model.getInstance().migrate();
            
            const schemaAdapter = Model.getConnection().getSchema() as TestSchemaAdapter;
            assert.notEqual(schemaAdapter.created.length, 0, 
                "There should be changes.");
            
            const databaseVersionChange = schemaAdapter.created[1];
            assert.equal(databaseVersionChange.getName(), DatabseVersion.name, 
                "DatabaseVerison should be created first.");
            
            const testGroupChange = schemaAdapter.created[1];
            assert.equal(testGroupChange.getName(), TestGroup.name, 
                "TestGroup should be created second.");

            const testUserChange = schemaAdapter.created[2];
            assert.equal(testUserChange.getName(), TestUser.name, 
                "TestUser should be created third.");

        });
    });
});