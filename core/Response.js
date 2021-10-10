const { Writable } = require("readable-stream");

class Response extends Writable{
    #controller;

    /**
     * @param {require("essentials/core/Controller").Controller} controller 
     */
    constructor(controller){
        this.controller = controller;
    }
}

module.exports = Response;