import { RenderEngine } from "@fortles/core";
export default class SitemapRenderEngine extends RenderEngine {
    dispatch(request, response) {
        let router = response.getController().getRouter();
        for (let route of router.getRoutes()) {
            this.render(route.getName(), response);
        }
    }
    render(url, response) {
        response.write('<loc>' + url + '</loc>');
    }
    beforeDispatch(request, response) {
        response.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">');
    }
    afterDispatch(request, response) {
        response.write('</url></urlset>');
    }
}
//# sourceMappingURL=SitemapRenderEngine.js.map