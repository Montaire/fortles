import { Application } from "@fortles/core";
import { TestRenderEngine, TestResponse } from "@fortles/test-utility";
export default class TestApplication extends Application {
    constructor(platform, mainController) {
        super(platform, mainController);
        this.renderEngines.set("text/html", new TestRenderEngine());
    }
    simulate(request) {
        let response = new TestResponse(this.mainController);
        this.dispatch(request, response);
        return response;
    }
}
//# sourceMappingURL=TestApplication.js.map