import { Controller, Request, Response } from "@fortles/core";
import { TestUtility } from "@fortles/test-utility";
import assert from "assert";

class TestController extends Controller{
    public viewCounter = 0;
    public view(request: Request, response: Response): void {
        this.viewCounter++;
        response.setData({counter: this.viewCounter});
    }
}

describe("Controller", function(){
    describe("View", function(){
        it("Can pass variables to view", function(){
            let controller = new TestController();
            controller.getRouter().createDefaultRoute();
            let response = TestUtility.render(controller, [
                TestUtility.createTemplate("Called: ${counter}", "Test")
            ]);
            assert.equal(response.getBody(), "Called: 1");
        });
        it("Calls view only once, even if multiple Blocks are present", function(){
            let controller = new TestController();
            controller.getRouter().createDefaultRoute()
                .addTemplate("block1", "template1")
                .addTemplate("block2", "template2");
            let response = TestUtility.render(controller, [
                TestUtility.createTemplate("<f:block name='block1' /><f:block name='block2' />", "Test"),
                TestUtility.createTemplate("Called: ${counter}", "template1"),
                TestUtility.createTemplate("Called: ${counter}", "template2")
            ]);
            assert.equal(
                response.getBody(), 
                "<div id=\"f-block-block1\">Called: 1</div><div id=\"f-block-block2\">Called: 1</div>"
            );
        });
    });
});