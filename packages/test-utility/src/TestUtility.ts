import { Application, Controller, Renderable, StringCharacterStreamReader, Template } from "@fortles/core";
import { TestServerPlatform, TestRenderEngine, TestRequest, TestResponse, TestApplication } from "@fortles/test-utility";

export default class TestUtility{

    /**
     * Creates a test Template with a given content.
     * @param content 
     * @returns 
     */
    public static createTemplate(content: string, name = "test"): Template{
        let reader = new StringCharacterStreamReader(content);
        return new Template(reader, name);
    }

    /**
     * Renders a template to a string.
     * @param template 
     */
    public static renderTemplate(template: Template, response: TestResponse = null): string{
        let request = new TestRequest();
        let renderEngine = new TestRenderEngine();
        response = response || new TestResponse();

        template.render(renderEngine, request, response);

        return response.toString();
    }

    /**
     * Creates and renders a template from the given content.
     * @param content 
     * @returns 
     */
    public static createAndRenderTemplate(content: string): string{
        return this.renderTemplate(this.createTemplate(content));
    }

    public static createServerApplication(mainController: Controller = null, templates: Template[] = []): TestApplication{
        let platform = new TestServerPlatform();

        if(!mainController){
            mainController = new Controller();
        }
        let application = new TestApplication(platform, mainController);
        let engine = new TestRenderEngine();

        application.getRenderEngines().set("text/html", engine);

        for(const template of templates){
            engine.setTemplate(template);
        }

        return application;
    }
    
    public static simulateRequest(request: TestRequest, mainController: Controller = null, templates: Template[] = []): TestResponse{
        let application = TestUtility.createServerApplication(mainController, templates);
        let response = new TestResponse(application.getMainController());
        application.dispatch(request, response);
        return response;
    }

    public static render(renderable: Renderable, templates: Template[] = [], request: TestRequest = new TestRequest()){
        let response = new TestResponse(renderable instanceof Controller ? renderable : new Controller());
        let engine = new TestRenderEngine();
        for(const template of templates){
            engine.setTemplate(template);
        }
        renderable.render(engine, request, response);
        return response;
    }
}