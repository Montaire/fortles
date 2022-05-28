import { Application, Platform, Controller } from "@fortles/core";
import { TestRequest, TestResponse } from "@fortles/test-utility";
export default class TestApplication extends Application {
    constructor(platform: Platform, mainController: Controller);
    simulate(request: TestRequest): TestResponse;
}
