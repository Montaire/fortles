import assert from "assert";
import { InvalidTemplateError } from "../index.js";
import TestUtility, { TestResponse } from "@essentials-framework/test-utility";
import EvalWriteableShard from "../template/EvalWriteableShard.js";
import Controller from "../Controller.js";

describe("Template", function(){
    describe("Shard", function(){
        describe("Anchor", function(){
            it("Anchor shard without go/do param is not valid", function(){
                assert.throws(() => TestUtility.createTemplate("<a></a><e:a/>"), InvalidTemplateError);
                assert.throws(() => TestUtility.createTemplate("<e:a class='boo'>Hello<e:a/>"), InvalidTemplateError);
            });
            it("Anchor shard with go param", function(){
                let template = TestUtility.createTemplate("<a></a><e:a go='party'>Test</e:a>");
                let controller = new Controller();
                controller.getRouter().createRoute("party", "party");
                let result = TestUtility.renderTemplate(template, new TestResponse(controller));
                assert.equal(result, '<a></a><a href="/party" onclick="E.go(this)">Test</a>');
            });
        });
        describe("Eval", function(){
            it("Aretmetic exspression evalutes", function(){
                let template = TestUtility.createTemplate("<p>${4+5}</p>");
                assert.equal(template.getShards().length, 3, "We should have 3 shards. Whe have " + template.getShards().length);
                assert(template.getShards()[1] instanceof EvalWriteableShard, "Eval shard not recogniesed.");
                assert.equal(TestUtility.createAndRenderTemplate("<p>${4+5}</p>"), "<p>9</p>", "Aritmetic calculation failed");
                assert.equal(TestUtility.createAndRenderTemplate("<p>${if(4 < 5){return 9;}}</p>"), "<p>9</p>", "Aritmetic calculation failed");
                assert.throws(() => TestUtility.createAndRenderTemplate("<p>${if 4 < 5 {return 9;}}</p>"), /Eval.+string:1:5/, "Syntax error detected at the correct palce");
            });
        });
    });
});