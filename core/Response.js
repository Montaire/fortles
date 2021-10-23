const { Writable } = require("readable-stream");

class Response extends Writable{
    #controller;

    /**
     * @param {require("essentials/core/Controller").Controller} controller 
     */
    constructor(controller){
        super();
        this.controller = controller;
    }

    getTemplateName(){
        return 'Main';
    }
}

module.exports = Response;