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

    getPrintResult(): string{
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
            console.log(command.getPrintResult());
            assert.match(command.getPrintResult(), /Usage:/);
            assert.equal(config, null, "Config should be null.");
        });
    });
    describe("Flags", function(){
        it("Runs with a bad flag", function(){
            let config = command.run(["-f"]);
            console.log(command.getPrintResult());
            assert.match(command.getPrintResult(), /Error:.+-f.+not known/);
            assert.equal(config, null, "Config should be null.");
        });
        it("Runs with multiple flags", function(){
            command
                .addFlag("one", "One Flag.", "o")
                .addFlag("two", "Two Flag.", "t")
                .addFlag("three", "Three Flag.");
            assert.deepEqual(command.run(["--one", "--two"]), {one: true, two: true});
            assert.deepEqual(command.run(["-o", "-t"]), {one: true, two: true});
            assert.deepEqual(command.run(["-ot"]), {one: true, two: true});
            assert.deepEqual(command.run(["-ot", "--three"]), {one: true, two: true, three: true});
        });
    });
    describe("Options", function(){
        command.addOption("one", "One options", {short: "o"});
    });
    describe("Attributes", function(){
        
    });
    describe("Complex", function(){

    });

});