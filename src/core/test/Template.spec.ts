import assert from "assert";
import { InvalidTemplateError } from "../index.js";
import TestUtility from "../../test-utility/index.js";

describe("Template", function(){
    describe("Shard", function(){
        describe("Anchor", function(){
            it("Anchor shard without go/do param is not valid", function(){
                assert.throws(() => TestUtility.createTemplate("<a></a><e:a/>"), InvalidTemplateError);
                assert.throws(() => TestUtility.createTemplate("<e:a class='boo'>Hello<e:a/>"), InvalidTemplateError);
            });
            it("Anchor shard with go param", function(){
                let template = TestUtility.createTemplate("<a></a><e:a go='party' >Test</e:a>");
                let result = TestUtility.renderTemplate(template);
                //assert.equal(result, '<a></a><a href="unknown" onclick="E.go(this)">Test</a>');
            });
        });
        describe("Eval", function(){
            it("Aretmetic exspression evalutes", function(){
                assert.equal(TestUtility.createAndRenderTemplate("<p>${4+5}</p>"), "<p>9</p>", "Aritmetic calculation failed");
            });
        });
    });
});