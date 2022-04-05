import { Response, Request, ChildResponse, NotFoundError} from "../../index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";
import { RenderEngine, TemplateRenderEngine } from "../../render/index.js";

export default class BlockControlShard extends ControlShard {

    /** Name of the current block */
    protected name: string;
    protected openingTag: string;

    public initialize(reader: CharacterStreamReader): void {
        this.name = this.attributes.get("name");
    }

    /**
     * @returns Name of the Shard
     */
    public getName(): string {
        return "block";
    }
    
    public render(engine: TemplateRenderEngine, request: Request, response: Response): void {
        let controller = response.getController();
        let router = controller.getRouter();
        let route = router.getRoute(request);
        if (route != null) {
            let routed = route.getBlock(this.name) || router.getDefaultRoute().getBlock(this.name);
            if (routed != null) {
                let blockPath = controller.getBlockPath();
                if(blockPath){
                    blockPath += '-'
                }
                response.write('<div id="f-block-' + (blockPath ? blockPath + '-' : '') + this.name + '">');
                if(routed.getController()){
                    let routedResponse = new ChildResponse(routed.getController(), response);
                    routedResponse.setTemplateName(routed.getTemplate());
                    routed.getController().render(engine, request, routedResponse);
                }else if(routed.getTemplate()){
                    let template = engine.getTemplate(routed.getTemplate());
                    template.render(engine, request, response);
                }
                response.write("</div>");
            }
        } else {
            throw new NotFoundError("Block could not be found.");
        }
    }

}