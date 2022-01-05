import { CharacterStreamReader } from "./index.js"

export default class StringCharacterStreamReader implements CharacterStreamReader{
    protected text: string;
    protected index = 0;
    protected line = 1;
    protected cursor = 0;
    constructor(text: string){
        this.text = text;
    }
    read(): string {
        if(this.index < this.text.length){
            let character = this.text[this.index++];
            if(character == "\n"){
                this.line++;
                this.cursor = 0;
            }else{
                this.cursor++;
            }
            return character;
        }else{
            return null;
        }
        
    }

    getCursor(): number{
        return this.cursor;
    }

    getLine(): number {
        return this.line;
    }
    getPath(): string {
        return "string";
    }
    getCursorPath(): string {
        return `string:${this.line}:${this.cursor}`;
    }
}