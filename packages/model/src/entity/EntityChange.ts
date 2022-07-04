import EntityDescriptor from "./EntityDescriptor";

export enum EntityChangeType{
    CREATE,
    DROP,
    ALTER
}

export class EntityChange{

    readonly from: EntityDescriptor;
    readonly to: EntityDescriptor;

    constructor(from: EntityDescriptor | null, to: EntityDescriptor | null){
        this.from = from;
        this.to = to;
    }
    
    getType(): EntityChangeType{
        if(this.from == null){
            return EntityChangeType.DROP;
        }else if(this.to == null){
            return EntityChangeType.CREATE;
        }else{
            return EntityChangeType.ALTER;
        }
    }
}