import { Template } from "../index.js";
export default class TemplateFactory {
    protected templates: Map<string, Template>;
    protected roots: {
        path: string;
        prefix: string;
    }[];
    build(path: string, prefix?: string): void;
    transverse(callback: (path: string, name: string) => void): void;
    transverseFolder(rootFolder: string, prefix: string, callback: (path: string, name: string) => void): void;
    createTemplate(path: string, name?: string): void;
    get(name: string): Template;
    set(template: Template): void;
}
