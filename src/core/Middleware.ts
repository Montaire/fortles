import { Request, Response } from "@montaire/e-core";

/**
 * Middleware class
 */
export default abstract class Middleware {
    /**
     * 
     * @param request Request from the application
     * @param response Response to the application
     * @returns Wether the Middleware stack should continue, or just close the response
     */
    public abstract run(request: Request, response: Response): boolean

    public getPriority(): number{
        return 100;
    }
}