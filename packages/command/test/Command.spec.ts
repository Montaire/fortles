import assert from "assert";
import { Command } from "../src/index.js";

class TestCommand extends Command{
    override style = {
        arguments: [],
        block: [],
        commands: [],
        description: [],
        error: [],
        flags: [],
        options: [],
        title: [],
    };

    printResult: string = "";

    protected override print(text: string): void{
        this.printResult += text + "\n";
    }

    getPrinted(): string{
        return this.printResult;
    }
}

describe("Command", function(){
    var command: TestCommand;
    beforeEach(function(){
        command = new TestCommand("test");
    });
    describe("Basic usage", function(){
        it("Runs simple command", function(){
            let config = command.run([]);
            assert.deepEqual(config, {}, "Config should be empty object.");
        });
        it("Prints a simple help", function(){
            let config = command.run(["-h"]);
            console.log(command.getPrinted());
            assert.match(command.getPrinted(), /Usage:/);
            assert.equal(config, null, "Config should be null.");
        });
    });
    describe("Sub Commands", function(){
        it("Runs simple sub command", function(){
            command.addCommand("one", "Command One");
            let config = command.run([]);
            assert.deepEqual(config, {}, "Config should be empty object.");
        });
        it("Prints help", function(){
            command.addCommand("one", "Command One");
            command.run(["-h"]);
            assert.match(command.getPrinted(), /Commands/, "Help should contain Commands section");
            assert.match(command.getPrinted(), /test one Command One/, "Help should contain the full path to call the subcommand, and the description.");
            command.run(["one", "-h"]);
            console.log(command.getPrinted());
        });
    });
    describe("Flags", function(){
        it("Runs with a bad flag", function(){
            let config = command.run(["-f"]);
            console.log(command.getPrinted());
            assert.match(command.getPrinted(), /Error:.+-f.+not known/);
            assert.equal(config, null, "Config should be null.");
        });
        it("Runs with multiple flags", function(){
            command
                .addFlag("one", "Flag one.", "o")
                .addFlag("two", "Flag two.", "t")
                .addFlag("three", "Flag three.");
            assert.deepEqual(command.run(["--one", "--two"]), {one: true, two: true});
            assert.deepEqual(command.run(["-o", "-t"]), {one: true, two: true});
            assert.deepEqual(command.run(["-ot"]), {one: true, two: true});
            assert.deepEqual(command.run(["-ot", "--three"]), {one: true, two: true, three: true});
            command.run(["-h"]);
            assert.match(command.getPrinted(), /Flags/, "Help should contain a Flags section.");
            assert.match(command.getPrinted(), /--one -o Flag one/, "Help should include short and long name as well.");

        });
    });
    describe("Options", function(){
        it("Runs with short and long name", function(){
            command.addOption("one", "Option one", {short: "o"});
            assert.deepEqual(command.run(["--one", "test"]), {"one": "test"});
            assert.deepEqual(command.run(["-o", "test"]), {"one": "test"});
        });
        it("Prints help", function(){
            command.addOption("one", "Option one", {short: "o"}).run(["-h"]);
            assert.match(command.getPrinted(), /Options/, "Help should contain an Options section.");
            assert.match(command.getPrinted(), /--one -o \[string\] Option one/, "Help should include short and long name as well.");
        });
        it("Runs with required options", function(){
            command
                .setEmptyFails(false)
                .addOption("one", "Option one", {required: true});
            assert.equal(command.run([]), null, "Command should return null, becouse processing the argument sould fail.");
            assert.doesNotMatch(command.getPrinted(), /Error/, "Printed result should not contain an Error message.");
            command.setEmptyFails(true);
            command.run([]);
            assert.match(command.getPrinted(), /Error/, "Printed result should contain an Error message.");
            assert.match(command.getPrinted(), /Missing!/, "Printed result should contain an 'Missing!' field message.");
            assert.match(command.getPrinted(), /Usage:.+--one/, "Usage should contain the required parameter.");
        });
        it("Runs a complex case", function(){
            command
                .addOption("one", "Option one", {short: "o"})
                .addOption("two", "Option two", {short: "t", required: true, variableType: Number})
                .addOption("three", "Option three", {variableType: Date})
                .addOption("four", "Option three", {
                    variableType: Date, 
                    variableTypeName: "hour",
                    variableExample: "13:37",
                    variableFormat: "HH:MM"
                });
            
            let config = command.run([]);
        });
    });
    describe("Attributes", function(){
        it("Runs with simple argument", function(){
            command.addArgument("one", "Argument one");
            assert.deepEqual(command.run(["test"]), {"one": "test"});
        });
        it("Prints help", function(){
            command
                .addArgument("one", "Argument one")
                .run(["-h"]);
            console.log(command.getPrinted());
            assert.match(command.getPrinted(), /Arguments/, "Help should contain an Arguments section.");
            assert.match(command.getPrinted(), /\[one string\] Argument one/, "Help should include the attribute");
        });
        
        it("Runs with multiple and required arguments", function(){
            command
                .addArgument("one", "Argument one")
                .addArgument("two", "Argument two", {required: true})
                .addArgument("three", "Argument three")
                .setEmptyFails(false)
                .run([]);
        });
    });
});