import { InvalidTemplateError, EvalWriteableShard, Controller } from "@fortles/core";
import { TestUtility, TestRenderEngine, TestRequest, TestResponse } from "@fortles/test-utility";
import assert from "assert";

describe("Template", function(){
    describe("Shard", function(){
        describe("Anchor", function(){
            it("Anchor shard without href param is not valid", function(){
                assert.throws(() => TestUtility.createTemplate("<a></a><f:a/>"), InvalidTemplateError);
                assert.throws(() => TestUtility.createTemplate("<f:a class='boo'>Hello<f:a/>"), InvalidTemplateError);
            });
            it("Anchor shard with href param", function(){
                let template = TestUtility.createTemplate("<a></a><f:a href='party()'>Test</f:a>");
                let controller = new Controller();
                controller.getRouter().createRoute("party", "party");
                let result = TestUtility.renderTemplate(template, new TestResponse(controller));
                assert.equal(result, '<a></a><a href="/party" onclick="Fortles.go(this)">Test</a>');
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
        describe("Block", function(){
            it("Renders the routed blocks properly", function(){
                let template1 = TestUtility.createTemplate("1 <f:block name='block2' /><f:block name='block3' /> 4", ".template1");
                let template2 = TestUtility.createTemplate("2", "template2");
                let template3 = TestUtility.createTemplate("3", ".template3");

                let controller2 = new Controller();
                controller2.getRouter().createDefaultRoute("template3");

                let mainController = new Controller();
                mainController.getRouter().createDefaultRoute("template1")
                    .addTemplate("block2", "template2")
                    .addController("block3", controller2);
                let response = new TestResponse(mainController);
                let request = new TestRequest();
                //Build render engine
                let engine = new TestRenderEngine();
                engine.setTemplate(template1);
                engine.setTemplate(template2);
                engine.setTemplate(template3);
                engine.dispatch(request, response);
                assert.equal(
                    response.getBody(), 
                    '1 <div id="f-block-block2">2</div><div id="f-block-block3">3</div> 4'
                );
            });
        });
    });
});