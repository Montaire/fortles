import assert from "assert";
import { ClassSerializer } from "../src/utlity/ClassSerializer.js";

class TestClass{
    public pox = 3;
    getPoxPlusOne() {
        return this.pox + 1;
    }
}

class TestClass2{
    public pox = 3;
}

describe("ClassSerializer", function(){
    it("Can serialize and deserialize simple class", function(){
        let serializableClass = new TestClass();
        serializableClass.pox += 1;
        ClassSerializer.register(TestClass);
        let serialized = ClassSerializer.export(serializableClass);
        let deserializedClass: TestClass = ClassSerializer.import(serialized);
        assert.deepEqual(deserializedClass, serializableClass);
        assert.equal(serializableClass.getPoxPlusOne(), deserializedClass.getPoxPlusOne(), "Restoring functions not worked.");
    });

    it("Throws if not registered the class", function(){
        let serializableClass = new TestClass2();
        assert.throws(() => ClassSerializer.import(ClassSerializer.export(serializableClass)));
    });
});