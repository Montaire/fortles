import { Application } from "../index.js";
import { CharacterStreamReader } from "../utility/index.js";
import { TemplateShard } from "./index.js";

export default class Template extends TemplateShard{
	protected name: string;
    protected path: string;

    constructor(reader: CharacterStreamReader, name: string = null, path: string = null){
        super(null);
        this.name = name;
        this.path = path;
        this.prepare(reader);
    }

    getName(): string{
        return this.name;
    }
}