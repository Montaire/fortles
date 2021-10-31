import Request, {RequestType} from "./Request";
import Response from "./Response";
import HtmlRenderEngine from "./render/HtmlRenderEngine";
import MainController from "../../../../src/controller/MainController";
import Platform from "../platform/Platform";
import { Controller } from "essentials";
import RenderEngine from "essentials/src/core/render/RenderEngine";

export default class Application{
	public platform: Platform;
	public mainController: Controller;
	public renderEngines: Map<string, RenderEngine>;

    /**
     * Creates a new application for the given platform
     * @param platform 
     */
    constructor(platform: Platform){
        this.platform = platform;
        try{
            this.mainController = new MainController;
        }catch(error){
            if(error.code == 'MODULE_NOT_FOUND'){
                throw new Error('You have to create a MainController class in your controller directory as your entry point.');
            }else{
                throw error;
            }
        }
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