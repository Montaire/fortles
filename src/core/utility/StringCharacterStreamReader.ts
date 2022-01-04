import { CharacterStreamReader } from "./index.js"

export default class StringCharacterStreamReader implements CharacterStreamReader{
    protected text: string;
    protected index = 0;
    protected lineNumber = 1;
    constructor(text: string){
        this.text = text;
    }
    read(): string {
        if(this.index < this.text.length){
            let character = this.text[this.index++];
            if(character == "\n"){
                this.lineNumber++;
            }
            return character;
        }else{
            return null;
        }

    }
    getLine(): number {
        return this.lineNumber;
    }
    getPath(): string {
        return "string";
    }

}