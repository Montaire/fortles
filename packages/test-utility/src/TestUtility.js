import { Controller, StringCharacterStreamReader, Template } from "@fortles/core";
import { TestServerPlatform, TestRenderEngine, TestRequest, TestResponse, TestApplication } from "@fortles/test-utility";
export default class TestUtility {
    /**
     * Creates a test Template with a given content.
     * @param content
     * @returns
     */
    static createTemplate(content, name = "test") {
        let reader = new StringCharacterStreamReader(content);
        return new Template(reader, name);
    }
    /**
     * Renders a template to a string.
     * @param template
     */
    static renderTemplate(template, response = null) {
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
    static createAndRenderTemplate(content) {
        return this.renderTemplate(this.createTemplate(content));
    }
    static createServerApplication(mainController = null, templates = []) {
        let platform = new TestServerPlatform();
        if (!mainController) {
            mainController = new Controller();
        }
        let application = new TestApplication(platform, mainController);
        let engine = new TestRenderEngine();
        application.getRenderEngines().set("text/html", engine);
        for (const template of templates) {
            engine.setTemplate(template);
        }
        return application;
    }
    static simulateRequest(request, mainController = null, templates = []) {
        let application = TestUtility.createServerApplication(mainController, templates);
        let response = new TestResponse(application.getMainController());
        application.dispatch(request, response);
        return response;
    }
    static render(renderable, templates = [], request = new TestRequest()) {
        let response = new TestResponse(renderable instanceof Controller ? renderable : new Controller());
        let engine = new TestRenderEngine();
        for (const template of templates) {
            engine.setTemplate(template);
        }
        renderable.render(engine, request, response);
        return response;
    }
}
//# sourceMappingURL=TestUtility.js.map