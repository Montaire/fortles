import { Application, Request, Response } from "../";

export default abstract class RenderEngine{
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
    public abstract dispatch(request: Request, response: Response): void;

    /**
     * Fired before the response
     * @param request 
     * @param response 
     */
    public beforeDispatch(request: Request, response: Response){}

    /**
     * 
     * @param request 
     * @param response 
     */
    public afterDispatch(request: Request, response: Response){} 
}