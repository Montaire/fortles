import WriteableShard from "./WriteableShard.js";

export default class EvalWriteableShard extends WriteableShard {

    /**
     * @type {Function}
     */
    compiledScript = null;
    fieldName = null;

    /**
     * Prepares the given script
     */
    ready(){
        if(this.content.length == 0){
            return;
        }
        if(this.content.match("[a-zA-Z0-9\\.]")){
            this.fieldName = this.content;
        }else{
            this.compiledScript = new Function(content);
        }
    }
    
    /**
     * 
     * @param {import("essentials/core/render/RenderEngine")} engine
     * @param {import("essentials").Request} request 
     * @param {import("essentials").Response} response 
     */
    render(engine, response) {
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