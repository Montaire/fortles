import EntityDescriptor from "./EntityDescriptor";

export enum ModelChangeType{
    CREATE,
    DROP,
    ALTER
}

export class ModelChange{

    readonly from: EntityDescriptor;
    readonly to: EntityDescriptor;

    constructor(from: EntityDescriptor | null, to: EntityDescriptor | null){
        this.from = from;
        this.to = to;
    }
    
    public getType(): ModelChangeType{
        if(this.from == null){
            return ModelChangeType.DROP;
        }else if(this.to == null){
            return ModelChangeType.CREATE;
        }else{
            return ModelChangeType.ALTER;
        }
    }

    public createReversed(): ModelChange{
        return new ModelChange(this.to, this.from);
    }

    public getEntityDescriptor(){
        return this.to || this.from;
    }
}