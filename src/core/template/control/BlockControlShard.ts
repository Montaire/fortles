import { Response, Request, ChildResponse, NotFoundError} from "../../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { TemplateShard, ControlShard } from "../index.js";
import { RenderEngine } from "../../render/index.js";

export default class BlockControlShard extends ControlShard {

    protected name: string;

    public initialize(attributes: Map<string, string>, reader: CharacterStreamReader): void {
        this.name = attributes.get("name");
    }

    public getName(): string {
        return "block";
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