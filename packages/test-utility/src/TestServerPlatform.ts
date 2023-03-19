import { Platform, Application } from "@fortles/core";
import { TestRequest, TestResponse } from "./index.js";

export default class TestServerPlatform extends Platform{
    
    application!: Application;
    
    public prepare(application: Application): void {
        this.application = application;
    }
    
    public run(application: Application): void {
        
    }

    public dispatch(request: TestRequest): TestResponse{
        let response = new TestResponse(this.application.getMainController());
        this.application.dispatch(request, response);
        return response;
    }
}