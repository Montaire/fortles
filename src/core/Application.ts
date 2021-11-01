import Request, {RequestType} from "./Request";
import Response from "./Response";
import HtmlRenderEngine from "./render/HtmlRenderEngine";
import Platform from "../platform/Platform";
import { Controller } from "essentials/src";
import RenderEngine from "essentials/src/core/render/RenderEngine";

export default class Application{
	public platform: Platform;
	public mainController: Controller;
	public renderEngines: Map<string, RenderEngine>;

    /**
     * Creates a new application for the given platform
     * @param platform 
     */
    constructor(platform: Platform, mainController: Controller){
        this.platform = platform;
        this.mainController = mainController;
        this.renderEngines.set('text/html', new HtmlRenderEngine());
    }

    run(): void{
        this.platform.run(this);
    }

    /**
     * This function should be called form the Platform
     * @param {Request} request 
     * @param {import("./Response.js").Response} response 
     */
    dispatch(request: Request, response: Response){
        let engine = this.getRenderEngine(request);
        switch(request.getType()){
            case RequestType.FULL:
                engine.beforeDispatch(request, response);
                engine.dispatch(this.mainController, request, response);
                engine.afterDispatch(request, response);
                break;
        }
        response.close();
    }

    /**
     * Gets the render engine from the mime type
     * @param request 
     */
    getRenderEngine(request: Request): RenderEngine{
        return this.renderEngines.get(request.getMime());
    }

    getMainController(): Controller{
        return this.mainController;
    }
}