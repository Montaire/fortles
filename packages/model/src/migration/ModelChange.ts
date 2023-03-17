import { EntityDescriptor } from "../index.js";

export enum ModelChangeType{
    CREATE,
    DROP,
    ALTER
}

export class ModelChange{

    readonly from: EntityDescriptor|null;
    readonly to: EntityDescriptor|null;

    constructor(from: EntityDescriptor | null, to: EntityDescriptor | null){
        this.from = from;
        this.to = to;
    }
    
    public getType(): ModelChangeType{
        if(this.from == null){
            return ModelChangeType.CREATE;
        }else if(this.to == null){
            return ModelChangeType.DROP;
        }else{
            return ModelChangeType.ALTER;
        }
    }

    public createReversed(): ModelChange{
        return new ModelChange(this.to, this.from);
    }

    public getEntityDescriptor(): EntityDescriptor{
        //At least one of them should exist
        return this.to || this.from as EntityDescriptor;
    }
}