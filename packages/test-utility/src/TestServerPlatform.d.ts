import { Platform, Application } from "@fortles/core";
import { TestRequest, TestResponse } from "@fortles/test-utility";
export default class TestServerPlatform extends Platform {
    application: Application;
    prepare(application: Application): void;
    run(application: Application): void;
    dispatch(request: TestRequest): TestResponse;
}
