import CharacterStreamReader from "essentials/src/utility/CharacterStreamReader";
import * as fs from "fs";

/**
 * Stream To read a file character by caracter
 * @extends Readable
 */
 export default class FileCharacterStreamReader implements CharacterStreamReader{
    protected buffer: Buffer;
    fd: number;
    constructor(path: string){
        this.buffer = Buffer.alloc(1);
        this.fd = fs.openSync(path, 'r');
    }

    /**
     * Reads the next character of the file.
     * @returns {?string} Character or null if the file ends
     */
    read(): string | null{
        if(fs.readSync(this.fd,this.buffer)){
            return this.buffer.toString();
        }else{
            fs.close(this.fd);
            return null;
        }
    }
}