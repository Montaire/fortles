import { Middleware, Request, Response } from "@fortles/core";

export default class I18nMiddleware extends Middleware{
    public run(request: Request, response: Response): boolean {
        //If the url contains the language, extract it
        let language = request.getPath().substring(0, 2);
        return true;
    }
}