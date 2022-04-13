import { Application } from "../index.js";
import { CharacterStreamReader } from "../utility/index.js";
import { TemplateShard } from "./index.js";

export default class Template extends TemplateShard{
	protected name: string;
	protected application: Application;

    constructor(reader: CharacterStreamReader, name: string = null, application: Application = null){
        super(null);
        this.name = name;
        this.application = application;
        this.prepare(reader);
    }

    getName(): string{
        return this.name;
    }

    getApplication(): Application{
        return this.application;
    }
}