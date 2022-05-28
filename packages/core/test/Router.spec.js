import assert from "assert";
import { TestRequest } from "@fortles/test-utility";
import { Controller, Router } from "../src/index.js";
class TestController1 extends Controller {
    buildRouter(router) {
        router.createDefaultRoute()
            .addTemplate("inner-block1", "inner-template1");
    }
}
describe("Router", function () {
    let controller = new Controller();
    let router = new Router(controller);
    before("Build Routes", function () {
        router.createDefaultRoute("defaultTemplate")
            .addController("block1", new Controller())
            .addTemplate("block2", "template2");
        router.createRoute("route1", "template1")
            .addController("block1", new TestController1())
            .addTemplate("block2", "template3");
    });
    it("Default route is correct", function () {
        let request = new TestRequest('/');
        let route = router.getRoute(request);
        assert.equal(route.getTemplate(), ".defaultTemplate", "Wrong template");
        assert.equal(route.getBlock("block2").getTemplate(), "template2", "Wrong template for block");
    });
    it("Simple named route is correct", function () {
        let request = new TestRequest('/route1');
        let route = router.getRoute(request);
        assert.equal(route.getTemplate(), "template1", "Wrong template");
        assert.equal(route.getBlock("block1").getController().constructor.name, "TestController1", "Wrong controller routed to the block");
    });
});
//# sourceMappingURL=Router.spec.js.map