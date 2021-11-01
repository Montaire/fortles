import {TemplateShard} from "./index";
import FileCharacterStream from "../utility/FileCharacterStreamReader";
import { Application } from "essentials/src";

export default class Template extends TemplateShard{
	protected name: string;
	protected application: Application;

    constructor(path: string, name:string = null, application: Application = null){
        super(null);
        let reader = new FileCharacterStream(path);
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