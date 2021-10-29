import Response from "../../Response.js";
import {NotFoundError} from "../../Error.js";
import ControlShard from "./ControlShard.js";

export default class BlockControlShard extends ControlShard {

    name = "";

    /**
     * 
     * @param {ReadableStream} reader 
     * @param {require("../TemplateShard").TemplateShard} parent 
     */
    constructor(reader,  parent) {
        super(reader, parent, "block");
        this.name = this.attributes["name"];
    }

    
    render(engine, response) {
        let controller = response.getController();
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