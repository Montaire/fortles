import { EntityFieldDecorator, Type, TypeUtility, Entity, ErrorReporter } from "../index.js";

type IntegerTypeConfig = {
    min?: number,
    max?: number,
    unsigned?: boolean,
    bytes?: number
};

export class IntegerType extends Type<number, IntegerTypeConfig>{

    public parse(input: string, error: ErrorReporter): number|null {
        let result = Number.parseInt(input);
        if(Number.isNaN(result)){
            if(input !== ""){
                error.invalid();
            }
            return null;
        }
        return result;
    }

    constructor(name: string | symbol, config: IntegerTypeConfig = {}){
        super(name, config);
        if(config.min){
            this.addValidation(x => x >= (config.min as number) ? null : "Should not be less than "+config.min);
        }
        if(config.max){
            this.addValidation(x => x <= (config.max as number) ? null : "Should not be greater than "+config.min);
        }
    }
}

export function integer(config?: IntegerTypeConfig): EntityFieldDecorator {
    return function(target: Entity|undefined, context: ClassFieldDecoratorContext): void{
        TypeUtility.setType(null, context.name,  new IntegerType(context.name, config));
    };
}