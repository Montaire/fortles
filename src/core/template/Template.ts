import { TemplateShard } from "./index.js";
import { FileCharacterStreamReader } from "../utility/index.js";
import { Application } from "../index.js";

export default class Template extends TemplateShard{
	protected name: string;
	protected application: Application;
    protected path: string;

    constructor(path: string, name:string = null, application: Application = null){
        super(null);
        let reader = new FileCharacterStreamReader(path);
        this.name = name;
        this.path = path;
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