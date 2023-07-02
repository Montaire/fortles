import assert from "assert";
import { EntityDescriptor, string, StringType } from "../src/index.js";
import { TestUser } from "./model/index.js";
import { ClassSerializer } from "../src/utlity/ClassSerializer.js";

class TestUserExtended extends TestUser{
    @string()
    extended?: string
}

class TestUserWronglyExtended extends TestUser{
    @string()
    override name: string = "Overriding is not possible"
}

describe("EntityDescriptor", function(){
    it("Can be extended in any order", function(){
        const testUser = new TestUser();
        const entityDescriptor = EntityDescriptor.create(TestUser, "base.js");
        entityDescriptor.append(TestUserExtended, "extended.js");
        assert(entityDescriptor.typeMap.get("extended") instanceof StringType, "Extended field should be avaliable.");
        assert.equal(entityDescriptor.baseEntityType, TestUser, 
            "The base class should be the 'TestUser' instead of '" + entityDescriptor.baseEntityType + "'.");
        assert.equal(entityDescriptor.getName(), "TestUser");
        assert.equal(entityDescriptor.sourceMap.get("name"), "base.js");
        assert.equal(entityDescriptor.sourceMap.get("extended"), "extended.js");

        //Build up in reverese order
        const entityDescriptorReverse = EntityDescriptor.create(TestUserExtended, "extended.js");
        entityDescriptorReverse.append(TestUser, "base.js");
        assert(entityDescriptorReverse.typeMap.get("extended") instanceof StringType, "Extended field should be avaliable.");
        assert.equal(entityDescriptorReverse.baseEntityType, TestUser, 
            "The base class should be the 'TestUser' instead of '" + entityDescriptorReverse.baseEntityType + "'.");
    });

    it("Can not override exisiting type", function(){
        const entityDescriptor = EntityDescriptor.create(TestUser, "base.js");
        assert.throws(() => {
            entityDescriptor.append(TestUserWronglyExtended, "extended.js");
        })
    });

    it("Can be serialized", function(){
        const entityDescriptor = EntityDescriptor.create(TestUser, "source/path.js");
        const exported = ClassSerializer.serialize(entityDescriptor);
        const imported = ClassSerializer.deserialize(exported);
        //Base entity only needed for building up the descriptors, for finding the base class.
        //When loading, it is possible that the base class is altered, so it should be ignored in this test.
        entityDescriptor.baseEntityType = null;
        assert.deepEqual(imported, entityDescriptor);
    });    
});