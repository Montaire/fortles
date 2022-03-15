import { Request, Response } from "./index.js";

/**
 * Middleware class
 */
export default interface Middleware {
    /**
     * 
     * @param request Request from the application
     * @param response Response to the application
     * @returns Wether the Middleware stack should continue, or just close the response
     */
    run(request: Request, response: Response): boolean

    getPriority(): number;
}