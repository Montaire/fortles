import { NotFoundError } from "../../index.js";
import { ControlShard } from "../index.js";
export default class BlockControlShard extends ControlShard {
    /** Name of the current block */
    name;
    openingTag;
    initialize(reader) {
        this.name = this.attributes.get("name");
    }
    /**
     * @returns Name of the Shard
     */
    getName() {
        return "block";
    }
    render(engine, request, response) {
        let controller = response.getController();
        let router = controller.getRouter();
        let route = router.getRoute(request);
        if (route != null) {
            let block = route.getBlock(this.name) || router.getDefaultRoute().getBlock(this.name);
            if (block != null) {
                response.write('<div id="f-block-' + controller.getBlockPath(this.name) + '">');
                block.render(engine, request, response);
                response.write("</div>");
            }
        }
        else {
            throw new NotFoundError("Block could not be found.");
        }
    }
}
//# sourceMappingURL=BlockControlShard.js.map