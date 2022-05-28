import { InvalidTemplateError } from "../../index.js";
import { ControlShard } from "../index.js";
export default class AnchorControlShard extends ControlShard {
    url;
    initialize(reader) {
        let canonicalUrl = this.attributes.get("href");
        if (canonicalUrl == null) {
            throw new InvalidTemplateError("<f:a> needs a 'href' attribute", reader);
        }
        if (!canonicalUrl.includes(".")) {
            let templatePrefix = this.getTemplateName();
            templatePrefix = templatePrefix.substring(0, templatePrefix.lastIndexOf('.'));
            canonicalUrl = templatePrefix + "." + canonicalUrl;
        }
        this.url = canonicalUrl.substring(0, canonicalUrl.indexOf('(')).replace(".", "/");
    }
    getName() {
        return "a";
    }
    render(engine, request, response) {
        response.write("<a href=\"" + this.url + "\" onclick=\"Fortles.go(this)\">");
        super.render(engine, request, response);
        response.write("</a>");
    }
}
//# sourceMappingURL=AnchorControlShard.js.map