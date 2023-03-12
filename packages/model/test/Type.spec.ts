import assert from "assert";
import { TestGroup, TestUser } from "./model/index.js";
import { AssociationType } from "../src/index.js";

describe("Type", function(){
    describe("AssociationType", function(){
        it("Created properly from decorator", function(){
            const testUser = new TestUser();
            const groupAssociationType = TestUser.getModelInfo().typeMap.get("groups") as AssociationType<any>;
            assert.equal(groupAssociationType.getName(), "groups", "The name of the association is not set properly.");
            assert.equal(groupAssociationType.getSource(), TestUser, "The soruce of the association is not set properly.");
            assert.equal(groupAssociationType.getTarget(), TestGroup, "The target of the association is not set properly.");
        });
    });
});