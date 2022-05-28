import { Platform } from "@fortles/core";
import { TestResponse } from "@fortles/test-utility";
export default class TestServerPlatform extends Platform {
    application;
    prepare(application) {
        this.application = application;
    }
    run(application) {
    }
    dispatch(request) {
        let response = new TestResponse(this.application.getMainController());
        this.application.dispatch(request, response);
        return response;
    }
}
//# sourceMappingURL=TestServerPlatform.js.map