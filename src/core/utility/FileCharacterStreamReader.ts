import { CharacterStreamReader } from "./index.js";
import * as fs from "fs";

/**
 * Stream To read a file character by caracter
 * @extends Readable
 */
 export default class FileCharacterStreamReader implements CharacterStreamReader{

    protected buffer: Buffer;
    protected fd: number;
    protected line: number = 1;
    protected path: string;
    protected isOpen: boolean = true;

    constructor(path: string){
        this.buffer = Buffer.alloc(1);
        this.fd = fs.openSync(path, 'r');
        this.path = path;
    }

    /**
     * Reads the next character of the file.
     * @returns {?string} Character or null if the file ends
     */
    read(): string | null{
        if(!this.isOpen){
            return null;
        }
        if(fs.readSync(this.fd,this.buffer)){
            let c = this.buffer.toString();
            if(c === "\n"){
                this.line++;
            }
            return c;
        }else{
            fs.close(this.fd);
            this.isOpen = false;
            return null;
        }
    }

    /**
     * Gets the line number.
     * @returns Line number starting from 1.
     */
    getLine(): number{
        return this.line;
    }

    /**
     * Gets the path.
     * @returns The path of the current file.
     */
    getPath(): string{
        return this.path;
    }
}