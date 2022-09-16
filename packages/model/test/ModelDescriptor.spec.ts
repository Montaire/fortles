import assert from "assert";
import { before } from "mocha";
import { ModelChangeType, ModelDescriptor } from "../src/index.js";
import { TestGroup, TestUser } from "./model/index.js";

describe("ModelDescriptor", function(){
    let modelDescriptor: ModelDescriptor;

    this.beforeEach("Preapre Model", async function(){
        modelDescriptor = await ModelDescriptor.create(['./packages/model/test/model']);

    });

    it("Loads from entities", function(){
        const entityDescriptors = modelDescriptor.getEntityDescriptors();
        assert(entityDescriptors.find(x => x.baseEntityType == TestGroup), "TestGroup is missing.");
        assert(entityDescriptors.find(x => x.baseEntityType == TestUser), "TestUser is missing.");
    });

    it("Detects create changes", function(){
        const changes = modelDescriptor.getChanges(new ModelDescriptor());

        const testUserChange = changes.find(x => x.getEntityDescriptor().baseEntityType == TestUser);
        assert(testUserChange, "Create change for thrs user should exists.");
        assert.equal(testUserChange.getType(), ModelChangeType.CREATE);
        assert.equal(testUserChange.from, null);
        assert.equal(testUserChange.to.baseEntityType, TestUser);

        const testGroupChange = changes.find(x => x.getEntityDescriptor().baseEntityType == TestUser);
        assert(testGroupChange, "Create change for thrs user should exists.");
        assert.equal(testGroupChange.getType(), ModelChangeType.CREATE);
        assert.equal(testGroupChange.from, null);
        assert.equal(testGroupChange.to.baseEntityType, TestUser);
    });

    it("Serializes and deserializes", async function(){
        const path = "./temp/serialized-model-descriptor.js";
        ModelDescriptor.serialize2(modelDescriptor, path);
        const deserialized = await ModelDescriptor.deserialize2(path);
        //BaseEntityType is needed for building up the model descriptor only.
        //It makes no sense, or even exits when a snapshot is loaded, deserialized.
        for(const entityDescriptor of modelDescriptor.getEntityDescriptors()){
            entityDescriptor.baseEntityType = null;
        }
        //@ts-ignore
        //console.log(modelDescriptor.getEntityDescriptors()[0].typeMap, deserialized.getEntityDescriptors()[0].typeMap);
        console.log(TestUser.toString());
        assert.deepEqual(modelDescriptor, deserialized);
    });
});