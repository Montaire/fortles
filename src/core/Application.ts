import Request from "./Request.js";
import HtmlRenderEngine from "./render/HtmlRenderEngine.js";

export default class Application{
	public platform: any;
	public mainController: any;
	public renderEngines: any;

    /**
     * Creates a new application for the given platform
     * @param {import("./platform/Platform.js").Platform} platform 
     */
    constructor(platform){
        this.platform = platform;
        try{
            this.mainController = import('../../../controller/MainController.js');
        }catch(error){
            if(error.code == 'MODULE_NOT_FOUND'){
                throw new Error('You have to create a MainController class in your controller directory as your entry point.');
            }else{
                throw error;
            }
        }
        this.renderEngines = {
            'text/html': new HtmlRenderEngine()
        }
    }

    run(){
        this.platform.run(this);
    }

    /**
     * This function should be called form the Platform
     * @param {Request} request 
     * @param {import("./Response.js").Response} response 
     */
    dispatch(request, response){
        let engine = this.getRenderEngine(request);
        switch(request.getType()){
            case Request.Type.FULL:
                engine.beforeDispatch(request, response);
                engine.dispatch(this.mainController, request, response);
                engine.afterDispatch(request, response);
                break;
        }
        response.end();
    }

    /**
     * Gets the render engine from the mime type
     * @param {Request} request 
     */
    getRenderEngine(request){
        return this.renderEngines[request.getMime()];
    }
}