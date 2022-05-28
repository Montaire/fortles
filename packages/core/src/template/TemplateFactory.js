import { Template, FileCharacterStreamReader, RuntimeError } from "../index.js";
import * as fs from "fs";
export default class TemplateFactory {
    templates = new Map();
    roots = [];
    build(path, prefix = null) {
        this.roots.push({
            path: path,
            prefix: prefix
        });
        this.transverseFolder(path, prefix, this.createTemplate.bind(this));
    }
    transverse(callback) {
        for (const { path, prefix } of this.roots) {
            this.transverseFolder(path, prefix, callback);
        }
    }
    transverseFolder(rootFolder, prefix = null, callback) {
        let files = fs.readdirSync(rootFolder, { withFileTypes: true });
        for (let file of files) {
            let name = prefix ? prefix + '/' + file.name : file.name;
            if (file.isDirectory()) {
                this.transverseFolder(rootFolder + '/' + file.name, name, callback);
            }
            else {
                //Remove Extension
                name = name.replace(/\.[^/.]+$/, "");
                callback(rootFolder + "/" + file.name, name);
            }
        }
    }
    createTemplate(path, name = null) {
        let reader = new FileCharacterStreamReader(path);
        if (!name) {
            let result = path.match(/.+?template[\\\/](.+)\.[^/.]+$/);
            if (!result || !result[1]) {
                throw new RuntimeError("Cant extract template name from '" + path + "'");
            }
            name = result[1];
        }
        this.set(new Template(reader, name));
    }
    get(name) {
        return this.templates.get(name);
    }
    set(template) {
        this.templates.set(template.getName(), template);
    }
}
//# sourceMappingURL=TemplateFactory.js.map