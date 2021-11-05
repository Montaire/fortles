import { RenderEngine } from "../render/index.js";
import { WriteableShard } from "./index.js";
import { Request, Response } from "../index.js";

export default class EvalWriteableShard extends WriteableShard {

    /**
     * @type {Function}
     */
    compiledScript: Function;
    fieldName: string;

    /**
     * Prepares the given script
     */
    ready(): void{
        if(this.content.length == 0){
            return;
        }
        if(this.content.match("[a-zA-Z0-9\\.]")){
            this.fieldName = this.content;
        }else{
            this.compiledScript = new Function(this.content);
        }
    }
    
    /**
     * 
     * @param engine
     * @param request 
     * @param response 
     */
    render(engine: RenderEngine, request:Request, response:Response): void {
        if(this.fieldName != null){
            let data = response.getData()[this.fieldName];
            if(data){
                response.write(response.getData()[this.fieldName]);
            }
        }else{
            response.write(this.compiledScript.call(response.getData()));
        }
    }
}