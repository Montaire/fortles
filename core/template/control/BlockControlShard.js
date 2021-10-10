const { Response } = require("essentials");
const { NotFoundError } = require("essentials/core/Error");
const ControlShard = require("essentials/core/template/control/ControlShard");

class BlockControlShard extends ControlShard {

    name = "";

    /**
     * 
     * @param {ReadableStream} reader 
     * @param {require("../TemplateShard").TemplateShard} parent 
     */
    constructor(reader,  parent) {
        super(reader, parent, "block");
        this.name = attributes.get("name");
    }

    render(engine, response) {
        let controller = response.getSoruce();
        let route = controller.getRoute();
        if (route != null) {
            routed = route.get(this.name);
            if (routed != null) {
                engine.write('<div id="e-'+routed.controller.getEUri()+'">');
                let routedResponse = new Response(routed.controller);
                routedResponse.setTemplateName(routed.template);
                routed.controller.render(engine, request, routedResponse);
                engine.write("</div>");
            }
        } else {
            throw new NotFoundError("Block could not be found.");
        }
    }

}