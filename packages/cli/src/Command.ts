export type OptionConfig<T = String> = {
    short?: string,
    required?: boolean,
    default?: T,
    variableType?: new(x: string) => T,
    variableName?: string,
    example?: string
};

export type FlagConfig= {
    short?: string
};

export type ArgumentConfig<T = String> = {
    required?: boolean,
    variableType?: new(x: string) => T,
    variableName?: string,
    example?: string,
    default?: string
};

export abstract class CommandBlock<C = any>{

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

    public getFullName(): string{
        return this.name;
    }
    
    public getConfig(): C{
        return this.config;
    }

    public setDescription(text: string): this{
        this.description = text;
        return this;
    }

    public getDescription(): string{
        return this.description;
    }

    public process(args: string[], position: number, config: any):number{
        return null;
    }
}

export class CommandError extends Error{
    protected block: CommandBlock;
    protected shortMessage: string;
    constructor(message: string, block?: CommandBlock, shortMessage?: string, options?: ErrorOptions){
        super(message, options)
    }
    getShortMessage(): string{
        return this.shortMessage;
    }

    getBlock(): CommandBlock{
        return this.block;
    }
}

export class FlagCommandBlock extends CommandBlock<FlagConfig>{
    static override title = "Flags";

    override getFullName(): string{
        return " --" + this.name + (this.config.short ? " -" + this.config.short : "");
    }

    public override process(args: string[], position: number, config: FlagConfig): number {
        config[this.getName()] = true;
        return position;
    }
}

export class OptionCommandBlock<T> extends CommandBlock<OptionConfig<T>>{
    static override title = "Options";
    
    override getFullName(): string{
        let name = " --" + this.name + (this.config.short ? " -" + this.config.short : "");
        name += this.config.required ? " <" :  " [";
        name += this.config.variableType && this.config.variableType.name.toLowerCase() || "string";
        if(this.config.default){
            name += ": " + this.config.default;
        }else{

        }
        name += this.config.required ? ">" :  "]";
        return name;
    }
    public override process(args: string[], position: number, config: OptionConfig<T>): number {
        position++;
        config[this.getName()] = this.config.variableType ? new this.config.variableType(args[position]): args[position];
        return position;
    }
}

export class ArgumentCommandBlock<T> extends CommandBlock<ArgumentConfig<T>>{
    static override title = "Arguments";
    public override process(args: string[], position: number, config: ArgumentConfig<T>): number {
        config[this.getName()] = this.config.variableType ? new this.config.variableType(args[position]): args[position];
        return position;
    }
}

export class Command<Config = {}> extends CommandBlock<{}>{
    
    static override title = "Commands";
    protected commands = new Map<string, Command>();
    protected flags = new Map<string, CommandBlock<FlagConfig>>();
    protected options = new Map<string, CommandBlock<OptionConfig<any>>>();
    protected arguments: CommandBlock<ArgumentConfig<any>>[] = [];
    protected blocks =  new Map<string, CommandBlock>();
    protected descriptionText: string = null;
    protected parent: Command;
    protected title: string;
    protected action: (config: Config) => void;

    public style = {
        title: [CommandFormat.Underscore, CommandFormat.Bright],
        block: [CommandFormat.Bright],
        description: [],
        commands: [CommandFormat.FgYellow],
        flags:  [CommandFormat.FgCyan],
        options:  [CommandFormat.FgBlue],
        arguments:  [CommandFormat.FgGreen],
        error: [CommandFormat.Bright, CommandFormat.FgRed]
    }
    
    public blockTypes = {
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
        const block = new OptionCommandBlock<Type>(name, description, config)
        this.options.set(name, block);
        this.blocks.set((name.length == 1 ? "-" : "--") +  name, block);
        if(config.short){
            this.blocks.set("-" + config.short, block);
        }
        return this as any;
    }

    public addFlag<Name extends string>(name: Name, description: string, short: string = null): Command<Config & {[name in Name]: Boolean}>{
        const block = new FlagCommandBlock(name, description, {short: short});
        this.flags.set(name, block);
        this.blocks.set((name.length == 1 ? "-" : "--") +  name, block);
        if(short){
            this.blocks.set("-" + short, block);
        }
        return this as any;
    }
    
    public addArgument<Name extends string, Type = String>(name: Name, description: string, config: ArgumentConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        const block =  new ArgumentCommandBlock<Type>(name, description, config);
        this.arguments.push(block);
        return this as any;
    }
    
    public setTitle(title: string): this{
        this.title = title;
        return this;
    }

    public getTitle(): string{
        return this.title || this.getFullName();
    }
    
    public run(args: string[] = null): Config|null{
        if(!args){
            args = process.argv.splice(2);
        }
        if(this.commands.has(args[0])){
            this.commands.get(args[0]).run(args.splice(1));
            return;
        }
        //Process arguments on failure or help show help.
        let config = {} as any;
        let errors = new Map<CommandBlock, string>();
        try{
            config = this.processArguments(args);
        }catch(error){
            this.print(Command.format(error, ...this.style.error));
            if(error instanceof CommandError && error.getBlock() && error.getShortMessage()){
                errors.set(error.getBlock(), error.getShortMessage());
            }
        }
        let defaultBlocks =  Array.from(this.blocks.values()).filter(x => x.getConfig().default !== undefined);
        defaultBlocks = defaultBlocks.concat(this.arguments.filter(x => x.getConfig().default !== undefined));
        console.log(defaultBlocks);
        for(const defaultBlock of defaultBlocks){
            if(config[defaultBlock.getName()] === undefined){
                config[defaultBlock.getName()] = defaultBlock.getConfig().default;
            }
        }
        let requiredBlocks: CommandBlock[] = Array.from(new Set(this.blocks.values())).filter(x => x.getConfig().required);
        requiredBlocks = requiredBlocks.concat(this.arguments.filter(x => x.getConfig().required));

        if(requiredBlocks.length){
            const missingBlocks = requiredBlocks.filter(x => config[x.getName()]);
            if(missingBlocks.length){
                for(const required of missingBlocks){
                    errors.set(required, "Missing!");
                }
                this.print(
                    Command.format(missingBlocks.map(x => x.getName()).join(", ") + 
                    (missingBlocks.length > 1 ? " are" : " is") + " required", 
                    ...this.style.error));
            }

            config = null;
        }
        if(config && config.help){
            config = null;
        }
        if(config){         
            //On success run config
            if(this.action){
                this.action(config);
            }
            return config;
        }else{
            this.printHelp(errors);
            return null;
        }
    }
    
    protected processArguments(args: string[]): Config| null{
        //explode short config
        const pargs = [];
        for(const arg of args){
            if(arg.length > 2 && arg.startsWith("-") && !arg.startsWith("--")){
                for(const c of arg.substring(1)){
                    pargs.push("-" + c);
                }
            }else{
                pargs.push(arg);
            }
        }
        let config: Config = {} as Config;
        let argumentNumber: number = 0;
        for(let i=0; i<pargs.length; i++){
            if(pargs[i].startsWith("-")){
                if(!this.blocks.has(pargs[i])){
                    throw new CommandError(`Flag or Option '${pargs[i]}' is not known.`);
                }
                let block = this.blocks.get(pargs[i]);
                i = block.process(pargs, i, config);
            }else{
                let argument = this.arguments[argumentNumber];
                i = argument.process(pargs, i, config);
            }
        }
        return config || null;
    }

    protected printHelp(errors: Map<CommandBlock, string>){
        this.print(Command.format(this.getTitle(), ...this.style.title));
        let usage = "Usage: " + this.getFullName();
        for(const blockName in this.blockTypes){
            for(const block of this[blockName].values()){
                if(block.getConfig().required){
                    let blockValue: string;
                    if(block instanceof ArgumentCommandBlock){
                        blockValue = "";
                    }else if(block.getConfig().short){
                        blockValue = " -" + block.getConfig().short;
                    }else{
                        blockValue = " --" + block.getConfig().short;
                    }
                    blockValue += " <" + (
                        block.getConfig().example || 
                        block.getConfig().default || (
                            block.getConfig().variableType && 
                            block.getConfig().variableType.name.toLowerCase()) ||
                         "string") +">";
                         
                        usage += Command.format(
                        blockValue,
                        ...this.style[blockName]); 
                }
            }
            if(this[blockName].size > 0){
                const required = blockName == "commands" && !this.action;
                usage += " " + Command.format(
                    (required ? "<" : "[") + 
                    this.blockTypes[blockName].title.toLowerCase() + 
                    (required ? ">" : "]"), 
                    ...this.style[blockName]);
            }
        }
        this.print(usage);
        this.print(Command.format(this.getDescription(), ...this.style.description));
        for(const blockName in this.blockTypes){
            
            this.printHelpFor(blockName, errors);
        }
    }

    protected printHelpFor(blockName: string, errors?: Map<CommandBlock, string>){
        const map = this[blockName] as Map<string, CommandBlock>;
        const block = this.blockTypes[blockName] as typeof CommandBlock;
        if(map.size > 0){
            this.print(Command.format(block.title, ...this.style.title))
            for(const block of map.values()){
                const format = this.style.block.concat(this.style[blockName]);
                this.print(
                    Command.format(block.getFullName(),  ...format) + " " + 
                    block.getDescription()  + 
                    (errors.has(block) ? Command.format(" (" + errors.get(block) + ")", ...this.style.error) : ""));
            }
        }
    }

    public override getFullName(){
        return this.parent ? (this.parent.getFullName() + " " + this.name) : this.name;
    }

    protected print(text: string): void{
        console.info(text);
    }

    public static print(text: string){
        console.info(text);
    }

    public setAction(runnable: (config: Config) => void): this{
        this.action = runnable;
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