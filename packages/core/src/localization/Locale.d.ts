export default class Locale {
    constructor(language?: string, region?: string, guessed?: boolean);
    static get(locale: string): Locale;
}
