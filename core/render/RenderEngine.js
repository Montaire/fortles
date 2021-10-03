class RenderEngine{

    /**
     * 
     * @param {essentials.Application} application 
     */        
    constructor(application){
        this.application = application
    }

    /**
     * 
     * @param {essentials.Controller} controller 
     * @param {essentials.Request} request 
     * @param {essentials.Response} response 
     */
    dispatch(controller, request, response){
        
    }

    beforeDispatch(request, response){

    }

    afterDispatch(request, response){

    } 
}

module.exports = RenderEngine;