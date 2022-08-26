import { Connection, ModelDescriptor, Query, Migartor } from "./index.js";


export default class Model{

    protected modelDescriptor: ModelDescriptor;
    protected connections: Map<string, Connection>;

    constructor(modelDescriptor: ModelDescriptor = new ModelDescriptor(), connections = new  Map<string, Connection>()){
        this.modelDescriptor = modelDescriptor;
        this.connections = connections;
    }

    public migrate(): void{
        const migrator = new Migartor(this);
        migrator.migrate();
    }

    public getConnections(): Map<string, Connection>{
        return this.connections;
    }

    public getModelDescriptor(): ModelDescriptor{
        return this.modelDescriptor;
    }

    query<T>(type: new() => T): Query<T>{
        return null;
    }
}