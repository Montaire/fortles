import { Application, Platform, Controller } from "@fortles/core";
import { TestRenderEngine, TestRequest, TestResponse } from "./index.js";

export default class TestApplication extends Application{

    constructor(platform: Platform, mainController: Controller){
        super(platform, mainController);
        this.renderEngines.set("text/html", new TestRenderEngine());
    }

    public simulate(request: TestRequest){
        let response = new TestResponse(this.mainController);
        this.dispatch(request, response);
        return response;
    }
}