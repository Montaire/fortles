type VariableConfig<T = String> = {
    variableParser?: (x: string) => T,
    variableType?: new(x: string) => T,
    variableName?: string,
}

export type OptionConfig<T = String> = {
    short?: string,
    required?: boolean,
    default?: T,
    example?: string
} & VariableConfig<T>;

export type FlagConfig= {
    short?: string
};

export type ArgumentConfig<T = String> = {
    required?: boolean,
    example?: string,
    default?: string
} & VariableConfig<T>;

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
    /**
     * Returns the name of the command
     */
    public getName(): string{
        return this.name;
    }
    /**
     * Returns the name, including the parent commands name.
     * @returns The space separated full name.
     */
    public getFullName(): string{
        return this.name;
    }
    
    /**
     * Returns the conifgutation of the block.
     * @returns Configuration object.
     */
    public getConfig(): C{
        return this.config;
    }

    /**
     * Sets the description.
     * @param text Short 1 line explanation what the current function does.
     * @returns 
     */
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

/**
 * Error which can be displayed in the console.
 * Throw this, from the {@link Command.action}.
 * Name of the corresponding Attribute, Flag, or Option also can be set.
 */
export class CommandError extends Error{
    protected blockName: string;
    protected blockMessage: string;
    /**
     * Creates a new error to show in the command line.
     * @param message Error message.
     * @param blockName Name of the Attribute, Flag or Option which cousing the error. Leave empty for general errors.
     * @param blockMessage Error message to show after the Attribute, Flag or Option. Defaults to "Error"
     * @param options {@link Error} option to add the original error.
     */
    constructor(message: string, blockName?: string, blockMessage?: string, options?: ErrorOptions){
        super(message, options);
        this.blockMessage = blockMessage;
        this.blockName = blockName;
    }
    /**
     * Returns the error message for the Attribute, Flag or Option
     * @returns Defaults to "Error!"
     */
    getBlockMessage(): string{
        return this.blockMessage || "Error!";
    }

    /**
     * Returns the name of the Attribute, Flag or Option
     * @returns Returns null if the error has no corresponding Attribute, Flag or Option
     */
    getBlockName(): string | null{
        return this.blockName || null;
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

export class VariableCommandBlock<T, C extends VariableConfig<T>> extends CommandBlock<C>{
    protected parseVariable(text: string): T{
        if(this.config.variableParser){
            return this.config.variableParser(text);
        }else if(this.config.variableType){
            return new this.config.variableType(text);
        }else{
            //@ts-ignore
            return text;
        }
    }
}

export class OptionCommandBlock<T> extends VariableCommandBlock<T, OptionConfig<T>>{
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
        config[this.getName()] = this.parseVariable(args[position]);
        return position;
    }
}

export class ArgumentCommandBlock<T> extends VariableCommandBlock<T, ArgumentConfig<T>>{
    static override title = "Arguments";
    public override process(args: string[], position: number, config: ArgumentConfig<T>): number {
        config[this.getName()] = this.parseVariable(args[position]);
        return position;
    }
}

/**
 * A console command.
 */
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
    protected manual: string;
    protected action: (config: Config) => void;

    /**
     * Style of the different messages.
     */
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
    
    /**
     * Creates a new Command.
     * @param name Name of the command. Should match with the the on in the bin.
     * @param parent If sub command parent also needed.
     * @param help Outo inject the --help -h flag.
     */
    constructor(name: string, parent: Command = null, help: boolean = true){
        super(name, "", {});
        this.parent = parent;
        if(help){
            this.addFlag("help", "Show this help.", "h");
        }
    }
    /**
     * Adds a sub command to the current command.
     * Call this via <command name> [sub-command name]
     * @param name Name of the sub-command.
     * @returns Self for chaning.
     */
    public addCommand(name: string): Command{
        let command = new Command(name, this);
        this.commands.set(name, command);
        return command;
    }

    /**
     * Adds an option to the current Command. `--name <variable>, -n <variable>`
     * @param name Name of the option
     * @param description Short description of the command.
     * @param config {@link OptionConfig} Extra config for the option, like short name, required options.
     * @returns Self for chaining.
     */
    public addOption<Name extends string, Type = String>(name: Name, description: string, config: OptionConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        const block = new OptionCommandBlock<Type>(name, description, config)
        this.options.set(name, block);
        this.blocks.set((name.length == 1 ? "-" : "--") +  name, block);
        if(config.short){
            this.blocks.set("-" + config.short, block);
        }
        return this as any;
    }

    /**
     * Adds a flag to the current Command. `--name -n`
     * Flags can be used together. Eg: `-nh`
     * @param name Name of the flag. Eg: `--name`
     * @param description Short description of the flag.
     * @param short Short name of the flag. Eg: `-n`
     * @returns Self for chaining.
     */
    public addFlag<Name extends string>(name: Name, description: string, short: string = null): Command<Config & {[name in Name]: Boolean}>{
        const block = new FlagCommandBlock(name, description, {short: short});
        this.flags.set(name, block);
        this.blocks.set((name.length == 1 ? "-" : "--") +  name, block);
        if(short){
            this.blocks.set("-" + short, block);
        }
        return this as any;
    }
    
    /**
     * Adds an argument to the current Command. <name1> [name2]
     * Command are positional arguments.
     * @param name Name of the argument.
     * @param description  Short description of the argument.
     * @param config {@see ArgumentConfig} For extra configuration like required argumments.
     * @returns Self for chaining.
     */
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

    public setManual(text: string){
        this.manual = text;
    }
    
    /**
     * Runs the command
     * @param args Argument to run on. Leave null.
     * @returns Returns the cofiguration or null if the command can not be run.
     */
    public run(args: string[] = null): Config|null{
        if(!args){
            args = process.argv.splice(2);
        }
        if(this.commands.has(args[0])){
            this.commands.get(args[0]).run(args.splice(1));
            return;
        }
        if(this.parent && !this.action){
            throw new Error("Sub command '" + this.getName() + "' needs an action!");
        }
        //Process arguments on failure or help show help.
        let config = {} as any;
        let errors = new Map<string, string>();
        try{
            config = this.processArguments(args);
        }catch(error){
            this.print(Command.format(error, ...this.style.error));
            if(error instanceof CommandError && error.getBlockName()){
                errors.set(error.getBlockName(), error.getBlockMessage());
            }
            return null;
        }
        let defaultBlocks =  Array.from(this.blocks.values()).filter(x => x.getConfig().default !== undefined);
        defaultBlocks = defaultBlocks.concat(this.arguments.filter(x => x.getConfig().default !== undefined));
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
                    errors.set(required.getName(), "Missing!");
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
                try{
                    this.action(config);
                }catch(error){
                    if(error instanceof CommandError && error.getBlockName() && error.getBlockMessage()){
                        this.print(Command.format(error.message, ...this.style.error));
                        errors.set(error.getBlockName(), error.getBlockMessage());
                    }else{
                        throw error;
                    }
                }
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
                    throw new CommandError("Flag or Option '" + pargs[i]  + "' is not known.");
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

    protected printHelp(errors: Map<string, string>){
        this.print(Command.format(this.getTitle(), ...this.style.title));
        if(this.description){
            this.print(this.description);
        }
        let usage = "Usage: " + this.getFullName();
        if(this.manual){
            this.print(this.manual);
        }
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

    /**
     * Prints help for a given {@link CommandBlock} type
     * @param blockName 
     * @param errors 
     */
    protected printHelpFor(blockName: string, errors?: Map<string, string>){
        const map = this[blockName] as Map<string, CommandBlock>;
        const block = this.blockTypes[blockName] as typeof CommandBlock;
        if(map.size > 0){
            this.print(Command.format(block.title, ...this.style.title))
            for(const block of map.values()){
                const format = this.style.block.concat(this.style[blockName]);
                this.print(
                    Command.format(block.getFullName(),  ...format) + " " + 
                    block.getDescription()  + 
                    (errors.has(block.getName()) ? Command.format(" (" + errors.get(block.getName()) + ")", ...this.style.error) : ""));
            }
        }
    }

    public override getFullName(){
        return this.parent ? (this.parent.getFullName() + " " + this.name) : this.name;
    }

    /**
     * Prints a text to the console.
     * @param text Text to print.
     */
    protected print(text: string): void{
        console.info(text);
    }

    /**
     * Prints a text to the console.
     */
    public static print(text: string){
        console.info(text);
    }

    /**
     * Sets a function which will be called, if the command is called.
     * It is required for sub commands.
     * @param runnable To singal an error, throw a {@link CommandError}
     * @returns Self for chaining.
     */
    public setAction(runnable: (config: Config) => void): this{
        this.action = runnable;
        return this;
    }

    /**
     * Formats a text for the console.
     * Formatting will be reseted after the given string.
     * @param text Text to format.
     * @param format Formatting Enumerations.
     * @returns Formatted text.
     */
    static format(text: string, ...format: CommandFormat[]): string{
        return format.join("") + text + (format.length > 0 ? CommandFormat.Reset : "");
    }

    /**
     * Creates a new command.
     * @param name Name of the command. It should be called with this from the console.
     * @returns Command to decorate.
     */
    static create(name: string): Command{
        return new Command(name);
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