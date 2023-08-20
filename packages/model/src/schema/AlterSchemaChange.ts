import { Connection, CreateSchemaChange, EntityDescriptor, SchemaChange, Type } from "../index.js";

export class AlterSchemaChange extends SchemaChange{

    public createFieldMap = new Map<string, Type<any, any>>();
    public alterFieldMap = new Map<string, Type<any, any>>();
    public dropFields: string[] = [];
    public newName: string|null;

    constructor(name: string, newName: string|null = null){
        super(name);
        if(newName && newName != name){
            this.newName = newName;
        }else{
            this.newName = null;
        }
    }

    public override async applyTo(connection: Connection): Promise<void> {
        return connection.getSchema().alter(this);
    }

    
    public getCreateFieldMap(): Map<string, Type<any, any>>{
        return this.createFieldMap;
    }
    public getAlterFieldMap(): Map<string, Type<any, any>>{
        return this.alterFieldMap;
    }
    public getDropFields(): string[]{
        return this.dropFields;
    }

    public getNewName(): string|null{
        return this.newName;
    }

    public static createFromEntityDescriptor(from: EntityDescriptor, to: EntityDescriptor): AlterSchemaChange | null{
        const schemaChange = new this(from.getName(), to.getName());
        const fieldNames = new Set([...from.typeMap.keys(), ...to.typeMap.keys()]);
        let isChanged = from.getName() != to.getName();
        for(const fieldName of fieldNames){
            //Alter if field is present on both state, bit check if they are the same.
            if(from.typeMap.has(fieldName) && to.typeMap.has(fieldName)){
                const fromType = from.typeMap.get(fieldName) as Type<any, any>;
                const toType = from.typeMap.get(fieldName) as Type<any, any>;
                if(fromType.equials(toType)){
                    schemaChange.alterFieldMap.set(fieldName, to.typeMap.get(fieldName) as Type<any, any>);
                    isChanged = true;
                }
            //Create
            }else if(to.typeMap.has(fieldName)){
                schemaChange.createFieldMap.set(fieldName, to.typeMap.get(fieldName) as Type<any, any>);
                isChanged = true;
            //Drop
            }else{
                schemaChange.dropFields.push(fieldName);
                isChanged = true;
            }
        }
        return isChanged ? schemaChange : null;
    }
}