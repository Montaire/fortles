import { Application } from "../index.js";
import { CharacterStreamReader } from "../utility/index.js";
import { TemplateShard } from "./index.js";

export default class Template extends TemplateShard{
	protected name: string|null;
    protected path: string|null;

    constructor(reader: CharacterStreamReader, name: string|null = null, path: string|null = null){
        super(null);
        this.name = name;
        this.path = path;
        this.prepare(reader);
    }

    getName(): string|null{
        return this.name;
    }
}