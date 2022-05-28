import { CharacterStreamReader } from "../utility/index.js";
import { TemplateShard } from "./index.js";
export default class Template extends TemplateShard {
    protected name: string;
    protected path: string;
    constructor(reader: CharacterStreamReader, name?: string, path?: string);
    getName(): string;
}
