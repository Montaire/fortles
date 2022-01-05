import { Template } from "../core/template/index.js";
import { StringCharacterStreamReader } from "../core/utility/index.js";
import { TestRenderEngine, TestRequest, TestResponse } from "./index.js";

export default class TestUtility{

    /**
     * Creates a test Template with a given content.
     * @param content 
     * @returns 
     */
    public static createTemplate(content: string): Template{
        let reader = new StringCharacterStreamReader(content);
        return new Template(reader, "test");
    }

    /**
     * Renders a template to a string.
     * @param template 
     */
    public static renderTemplate(template: Template): string{
        let request = new TestRequest();
        let response = new TestResponse();
        let renderEngine = new TestRenderEngine();

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
}