import { RenderEngine, Request, Response } from "@fortles/core";

export default class SitemapRenderEngine extends RenderEngine{
    public dispatch(request: Request, response: Response): void {
        let router = response.getController().getRouter();
        for(let route of router.getRoutes()){
            if(route.getName()){
                this.render(route.getName() as string, response);
            }
        }
    }

    protected render(url: String, response: Response){
        response.write('<loc>'+url+'</loc>');
    }

    public beforeDispatch(request: Request, response: Response): void{
        response.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');
    }

    public afterDispatch(request: Request, response: Response): void{
        response.write('</url></urlset>');
    }
}