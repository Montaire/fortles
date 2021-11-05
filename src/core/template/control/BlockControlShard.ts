import { Response, Request, ChildResponse, NotFoundError} from "../../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { TemplateShard, ControlShard } from "../index.js";
import { RenderEngine } from "../../render/index.js";

export default class BlockControlShard extends ControlShard {

    protected name: string;

    /**
     * 
     * @param reader
     * @param parent 
     */
    constructor(reader: CharacterStreamReader,  parent: TemplateShard) {
        super(reader, parent, "block");
        this.name = this.attributes.get("name");
    }

    
    render(engine: RenderEngine, request: Request, response: Response): void {
        let controller = response.getController();
        let route = controller.getRouter().getRoute(request);
        if (route != null) {
            let routed = route.get(this.name);
            if (routed != null) {
                response.write('<div id="e-'+routed.getController().getEUri()+'">');
                let routedResponse = new ChildResponse(routed.getController(), response);
                routedResponse.setTemplateName(routed.getTemplate());
                routed.getController().render(engine, request, routedResponse);
                response.write("</div>");
            }
        } else {
            throw new NotFoundError("Block could not be found.");
        }
    }

}