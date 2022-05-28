import { FileCharacterStreamReader, StringCharacterStreamReader } from "../src/utility/index.js";
import * as path from "path";
import assert from "assert";
describe("Utility", function () {
    describe("FileCharacterStreamReader", function () {
        let reader;
        before("Opens the given file", function () {
            reader = new FileCharacterStreamReader(path.normalize(path.resolve() + '/packages/core/test/asset/SimpleText.txt'));
        });
        /* File looks like this
        01

        2
        */
        it("Reads the file properly", function () {
            assert.equal(reader.read(), '0', '1. line 1.character not matches');
            assert.equal(reader.getLine(), 1, 'We are not in the first line');
            assert.equal(reader.read(), '1', '1. line 2.character not matches');
            assert.equal(reader.getLine(), 1, 'We are not in the first line');
            assert.equal(reader.read(), '\n', 'End of the line not present');
            assert.equal(reader.getLine(), 2, 'We are not in the second line');
            assert.equal(reader.read(), '\n', 'End of the line not present');
            assert.equal(reader.getLine(), 3, 'We are not in the third line');
            assert.equal(reader.read(), '2', '3. line 1.character not matches');
            assert.equal(reader.getLine(), 3, 'We are not in the first line');
            assert.equal(reader.read(), null, 'Text should have ended');
        });
    });
    describe("StringCharacterStreamReader", function () {
        it("Reads the string properly", function () {
            let reader = new StringCharacterStreamReader('01\n\n2');
            assert.equal(reader.read(), '0', '1. line 1.character not matches');
            assert.equal(reader.getLine(), 1, 'We are not in the first line');
            assert.equal(reader.read(), '1', '1. line 2.character not matches');
            assert.equal(reader.getLine(), 1, 'We are not in the first line');
            assert.equal(reader.read(), '\n', 'End of the line not present');
            assert.equal(reader.getLine(), 2, 'We are not in the second line');
            assert.equal(reader.read(), '\n', 'End of the line not present');
            assert.equal(reader.getLine(), 3, 'We are not in the third line');
            assert.equal(reader.read(), '2', '3. line 1.character not matches');
            assert.equal(reader.getLine(), 3, 'We are not in the first line');
            assert.equal(reader.read(), null, 'Text should have ended');
        });
    });
});
//# sourceMappingURL=Utility.spec.js.map