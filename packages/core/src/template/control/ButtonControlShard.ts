import { InvalidTemplateError, Request, Response } from "../../index.js";
import { RenderEngine } from "../../render/index.js";
import { CharacterStreamReader } from "../../utility/index.js";
import { ControlShard } from "../index.js";

import { randomBytes } from 'crypto'

export default class AnchorControlShard extends ControlShard {

    protected action: string|null = null;

    public initialize(reader: CharacterStreamReader): void {
        this.action = this.attributes.get("action") ?? null;
    }

    public getName(): string {
        return "button";
    }

    public override render(engine: RenderEngine, request:Request, response: Response): void{
        let id = randomBytes(16);
        response.write("<button form=\"" + id + "\" " + this.rawAttributes + ">");
        super.render(engine, request, response);
        //Render the form
        response.write("<form id=\"" + id + "\"><input type=\"hidden\" name=\"fortlesAction\"> action=\"" + this.action + "\"");

        response.write("</form></button>");
    }
}