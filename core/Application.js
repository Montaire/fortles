const Request = require("./Request");
const {HtmlRenderEngine} = require("essentials/core/render");
class Application{

    /**
     * @param {Platform} platform 
     */
    constructor(platform){
        this.platform = platform;
        this.mainController = require(process.cwd() + '/controller/MainController');
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
     * @param {Response} response 
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
        console.log(request.getType());
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
module.exports = Application;