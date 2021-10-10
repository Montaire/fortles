class RenderEngine{

    /**
     * 
     * @param {import("essentials").Application} application 
     */        
    constructor(application){
        this.application = application
    }

    /**
     * Renders the whole tree from the given controller.
     * @param {import("essentials").Controller} controller 
     * @param {import("essentials").Request} request 
     * @param {import("essentials").Response} response 
     */
    dispatch(controller, request, response){
        
    }

    /**
     * 
     * @param {import("essentials").Request} request 
     * @param {import("essentials").Response} response 
     */
    beforeDispatch(request, response){

    }

    /**
     * 
     * @param {import("essentials").Request} request 
     * @param {import("essentials").Response} response 
     */
    afterDispatch(request, response){

    } 
}

module.exports = RenderEngine;