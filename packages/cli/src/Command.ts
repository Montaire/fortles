export type OptionConfig<T = String> = {
    short?: string,
    required?: boolean,
    default?: T,
    variable?: new() => T
};

export type FlagConfig= {
    short?: string
};

export type ArgumentConfig<T = String> = {
    required?: boolean,
    variable?: new() => T
};

export abstract class CommandBlock<C = {}>{

    static title: string;

    protected name: string;
    protected description: string;
    protected config: C;

    constructor(name: string, description: string, config: C){
        this.name = name;
        this.description = description;
        this.config = config;
    }

    public getName(): string{
        return this.name;
    }

    
    public setDescription(text: string): this{
        this.description = text;
        return this;
    }

    public getDescription(): string{
        return this.description;
    }
}

export class FlagCommandBlock extends CommandBlock<FlagConfig>{
    static override title = "Flags";

    override getName(): string{
        return " --" + this.name + (this.config.short ? " -" + this.config.short : "");
    }
}

export class OptionCommandBlock<T> extends CommandBlock<OptionConfig<T>>{
    static override title = "Options";

    override getName(): string{
        let name = " --" + this.name + (this.config.short ? " -" + this.config.short : "");
        name += this.config.required ? " <" :  " [";
        name += this.config.variable && this.config.variable.name.toLowerCase() || "string";
        if(this.config.default){
            name += ": " + this.config.default;
        }else{
        }
        name += this.config.required ? ">" :  "]";
        return name;
    }
}

export class ArgumentCommandBlock<T> extends CommandBlock<ArgumentConfig<T>>{
    static override title = "Arguments";
}

export class Command<Config = {}> extends CommandBlock<{}>{

    static override title = "Commands";
    protected commands = new Map<string, Command>();
    protected flags = new Map<string, CommandBlock<FlagConfig>>();
    protected options = new Map<string, CommandBlock<OptionConfig<any>>>();
    protected arguments = new Map<string, CommandBlock<ArgumentConfig<any>>>();
    protected descriptionText: string = null;
    protected parent: Command;
    protected title: string;
    protected runnable: (config: Config) => void;

    public style = {
        title: [CommandFormat.Underscore, CommandFormat.Bright],
        block: [CommandFormat.Bright],
        description: [],
        commands: [CommandFormat.FgBlack],
        flags:  [CommandFormat.FgCyan],
        options:  [CommandFormat.FgBlue],
        arguments:  [CommandFormat.FgGreen],
        error: [CommandFormat.FgRed]
    }

    public blocks = {
        commands: Command,
        flags: FlagCommandBlock,
        options: OptionCommandBlock,
        arguments: ArgumentCommandBlock
    }

    constructor(name: string, parent: Command = null, help: boolean = true){
        super(name, "", {});
        this.parent = parent;
        if(help){
            this.addFlag("help", "Show this help.", "h");
        }
    }

    public addCommand(name: string): Command{
        let command = new Command(name, this);
        this.commands.set(name, command);
        return command;
    }

    public addOption<Name extends string, Type = String>(name: Name, description: string, config: OptionConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        this.options.set(name, new OptionCommandBlock<Type>(name, description, config));
        return this as any;
    }

    public addFlag<Name extends string>(name: Name, description: string, short: string = null): Command<Config & {[name in Name]: Boolean}>{
        this.flags.set(name, new FlagCommandBlock(name, description, {short: short}));
        return this as any;
    }

    public addArgument<Name extends string, Type = String>(name: Name, description: string, config: ArgumentConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        this.arguments.set(name, new ArgumentCommandBlock<Type>(name, description, config));
        return this as any;
    }

    public setTitle(title: string): this{
        this.title = title;
        return this;
    }

    public getTitle(): string{
        return this.title || this.getFullName();
    }

    public run(args: string[] = null): void{
        if(!args){
            args = process.argv.splice(2);
        }
        if(this.commands.has(args[0])){
            this.commands.get(args[0]).run(args.splice(1));
            return;
        }
        //Process arguments on failure or help show help.
        if(this.processArguments(args)){         
            //On success run config
            this.runnable(this.getConfig());
        }else{
            this.printHelp();
        }
    }

    protected processArguments(args: string[]): boolean{
        return false;
    }

    protected printHelp(){
        this.print(Command.format(this.getTitle(), ...this.style.title));
        let usage = "Usage: " + this.getFullName();
        for(const blockName in this.blocks){
            if(this[blockName].size > 0){
                usage += " " + Command.format("<" + this.blocks[blockName].title.toLowerCase() + ">", ...this.style[blockName]);
            }
        }
        this.print(usage);
        this.print(Command.format(this.getDescription(), ...this.style.description));
        for(const blockName in this.blocks){
            this.printHelpFor(blockName);
        }
    }

    protected printHelpFor(blockName: string){
        const map = this[blockName] as Map<string, CommandBlock>;
        const block = this.blocks[blockName] as typeof CommandBlock;
        if(map.size > 0){
            this.print(Command.format(block.title, ...this.style.title))
            for(const block of map.values()){
                const format = this.style.block.concat(this.style[blockName]);
                this.print(Command.format(block.getName(),  ...format) + " " + block.getDescription());
            }
        }
    }

    protected getFullName(){
        return this.parent ? (this.parent.getFullName() + " " + this.name) : this.name;
    }

    protected print(text: string): void{
        console.info(text);
    }

    public static print(text: string){
        console.info(text);
    }

    protected getConfig(): Config{
        return null;
    }

    public setAction(runnable: (config: Config) => void): this{
        this.runnable = runnable;
        return this;
    }

    static format(text: string, ...format: CommandFormat[]): string{
        return format.join("") + text + (format.length > 0 ? "\x1b[0m" : "");
    }
}

export enum CommandFormat{
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",

    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",

    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m",

}