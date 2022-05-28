import { Controller, Renderable, Template } from "@fortles/core";
import { TestRequest, TestResponse, TestApplication } from "@fortles/test-utility";
export default class TestUtility {
    /**
     * Creates a test Template with a given content.
     * @param content
     * @returns
     */
    static createTemplate(content: string, name?: string): Template;
    /**
     * Renders a template to a string.
     * @param template
     */
    static renderTemplate(template: Template, response?: TestResponse): string;
    /**
     * Creates and renders a template from the given content.
     * @param content
     * @returns
     */
    static createAndRenderTemplate(content: string): string;
    static createServerApplication(mainController?: Controller, templates?: Template[]): TestApplication;
    static simulateRequest(request: TestRequest, mainController?: Controller, templates?: Template[]): TestResponse;
    static render(renderable: Renderable, templates?: Template[], request?: TestRequest): TestResponse;
}
