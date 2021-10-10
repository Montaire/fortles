class EvalWriteableShard extends WriteableShard {

    /**
     * @param {Function}
     */
    compiledScript = null;
    fieldName = null;

    /**
     * Prepares the given script
     */
    ready(){
        if(content.length() == 0){
            return;
        }
        let string = content.toString();
        if(string.matches("[a-zA-Z0-9\\.]")){
            this.fieldName = string;
        }else{
            this.compiledScript = new Function(string);
        }
    }
    
    /**
     * 
     * @param {require("essentials/core/render/RenderEngine")} engine
     * @param {require("essentials").Request} request 
     * @param {require("essentials").Response} response 
     */
    render(engine, request, response) {
        if(fieldName != null){
            engine.write(response.getData()[fieldName]);
        }else{
            engine.write(this.compiledScript.call(response.getData()));
        }
    }
}