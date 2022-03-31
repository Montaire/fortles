import { Platform, Application } from "@fortles/core";
import { TestRequest, TestResponse } from "@fortles/test-utility";

export default class TestPlatform extends Platform{

    application: Application;

    public run(application: Application): void {
        this.application = application;
    }

    public dispatch(request: TestRequest): TestResponse{
        let response = new TestResponse(this.application.getMainController());
        this.application.dispatch(request, response);
        return response;
    }
}