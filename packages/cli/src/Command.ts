export type OptionConfig<T> = {
    short?: string,
    required?: boolean,
    variable?: new() => T
};

export type ArgumentConfig<T> = {
    required?: boolean,
    variable?: new() => T
};

export class Option{
    
}

export class Command<Config = {}>{

    protected name: string;
    protected subCommands = new Map<string, Command>();
    protected descriptionText: string = null;
    protected runnable: (config: Config) => void

    public subCommand(name: string): Command{
        let subCommand = new Command();
        this.subCommands.set(name, subCommand);
        return subCommand;
    }

    public description(text: string): this{
        this.descriptionText = text;
        return this;
    }

    public option<Name extends string, Type = Boolean>(name: Name, description: string, config: OptionConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        return this as any;
    }

    public argument<Name extends string, Type = String>(name: Name, description: string, config: ArgumentConfig<Type> = {}): Command<Config & {[name in Name]: Type}>{
        return this as any;
    }

    public run(args: string[] = null): void{
        if(!args){
            args = process.argv.splice(2);
        }
        if(this.subCommands.has(args[0])){
            this.subCommands.get(args[0]).run(args.splice(1));
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

    protected getConfig(): Config{
        return null;
    }

    public action(runnable: (config: Config) => void): this{
        this.runnable = runnable;
        return this;
    }
}