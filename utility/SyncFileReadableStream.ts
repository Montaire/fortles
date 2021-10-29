import fs from "fs";

import { Readable } from "stream"; 

/**
 * Stream To read a file character by caracter
 * @extends Readable
 */
 export default class SyncFileReadableStream extends Readable{
    #buffer;
    #fd;
    constructor(path, options?){
        super(options);
        this.#buffer = Buffer.alloc(1);
        this.#fd = fs.openSync(path);
    }

    /**
     * Reads the next character of the file.
     * @returns {?string} Character or null if the file ends
     */
    read(){
        if(fs.readSync(this.#fd,this.#buffer)){
            return this.#buffer.toString();
        }else{
            fs.close(this.#fd);
            return null;
        }
    }
}