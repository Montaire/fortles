import { RenderEngine } from "../render/index.js";
import { WriteableShard } from "./index.js";
import { Request, Response, RuntimeError } from "../index.js";

export default class EvalWriteableShard extends WriteableShard {

    protected compiledScript: Function = null;
    protected fieldName: string = null;
    protected sourcePath: string;

    /**
     * Eval shard contains runnable javascript. It is possible to use return as well.
     * @param path The path of the template.
     * @param line Line number of the template
     */
    public constructor(path: string){
        super();
        this.sourcePath = path; 
    }

    /**
     * Prepares the given script
     */
    public ready(): void{
        if(this.content.length == 0){
            return;
        }
        try{
            if(this.content.match("^[a-zA-Z0-9\\.]+$")){
                this.fieldName = this.content;
            }else if(this.content.includes('return')){
                this.compiledScript = new Function(this.content);
            }else{
                this.compiledScript = new Function('return ' + this.content);
            }
        }catch(error){
            throw new RuntimeError("Eval shard '" + this.sourcePath + "' has error: " + error);
        }
    }
    
    public render(engine: RenderEngine, request:Request, response:Response): void {
        if(this.fieldName != null){
            let data = response.getData()[this.fieldName];
            if(data){
                response.write(data);
            }
        }else{
            response.write(this.compiledScript.call(response.getData()));
        }
    }
}