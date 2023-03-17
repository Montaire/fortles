export default class Locale{
    constructor(language: string|null = null, region: string|null = null, guessed: boolean = false){
        
    }

    static get(locale: string): Locale|null{
        return null;
    }
}