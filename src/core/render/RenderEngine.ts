import { Application, Request, Response } from "../";

export default class RenderEngine{
	protected application: Application;

    /**
     * 
     * @param application 
     */        
    constructor(application: Application){
        this.application = application
    }

    /**
     * Renders the whole tree from the given controller.
     * @param request 
     * @param response 
     */
    dispatch(request: Request, response: Response){
        
    }

    /**
     * 
     * @param request 
     * @param response 
     */
    beforeDispatch(request: Request, response: Response){

    }

    /**
     * 
     * @param request 
     * @param response 
     */
    afterDispatch(request: Request, response: Response){

    } 
}