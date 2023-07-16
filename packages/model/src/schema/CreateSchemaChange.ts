import { Connection, Driver, EntityDescriptor, SchemaChange, Type, TypeProperty, primaryKey } from "../index.js";

export class CreateSchemaChange extends SchemaChange{

    protected createFieldMap = new Map<string, Type<any, any>>();

    public addField(name: string, type: Type<any, any>){
        return new AddFieldSchemaOperation (this, type);
    }

    public override async applyTo(connection: Connection): Promise<void> {
        return connection.getSchema().create(this);
    }
    
    public static createFromEntityDescriptor(entityDescriptor: EntityDescriptor): CreateSchemaChange{
        const schemaChanage = new this(entityDescriptor.getName());
        schemaChanage.createFieldMap = entityDescriptor.typeMap;
        return schemaChanage;
    }
}

export class AddFieldSchemaOperation<S extends SchemaChange> {

    protected schemaChange: CreateSchemaChange;
    protected type: Type<any, any>;

    constructor(schemaChange: CreateSchemaChange, type: Type<any, any>){
        this.schemaChange = schemaChange;
        this.type = type;
    }

    public primaryKey(): this{
        this.type.setProperty(TypeProperty.PRIMARY_KEY, null);
        return this;
    }

    public addField(name: string, type: Type<any, any>){
        return this.schemaChange.addField(name, type);
    }
}