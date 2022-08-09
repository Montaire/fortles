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

    override print(text: string): void{
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
    describe("Basic", function(){
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
        });
    });
    describe("Options", function(){
        it("With short name", function(){
            command
                .addOption("one", "Option one", {short: "o"});
            assert.deepEqual(command.run(["--one", "test"]), {"one": "test"});
            assert.deepEqual(command.run(["-o", "test"]), {"one": "test"});
        });
        it("With required parameters", function(){
            command
                .addOption("one", "Option one", {required: true});
            assert.equal(command.run([]), null, "Command should return null, if processing the arguments fails");
            console.log(command.getPrinted());
            assert.match(command.getPrinted(), /error/, "Printed result should contain an Error message.");
            assert.match(command.getPrinted(), /Missing!/, "Printed result should contain an 'Missing!' field message.");
        });
        it("Runs complex case", function(){
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
            console.log(config);
            console.log(command.getPrinted());
        });
    });
    describe("Attributes", function(){
        
    });
    describe("Complex", function(){

    });

});