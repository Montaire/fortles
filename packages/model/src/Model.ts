import { Connection, ModelDescriptor, Query, Migartor } from "./index.js";


export default class Model{

    protected modelDescriptor: ModelDescriptor;
    protected connections: Map<string, Connection>;
    protected migrator: Migartor;

    constructor(modelDescriptor: ModelDescriptor = new ModelDescriptor(), connections = new  Map<string, Connection>()){
        this.modelDescriptor = modelDescriptor;
        this.connections = connections;
    }

    migrate(rootPath = "./"): void{

    }

    public getConnections(): Map<string, Connection>{
        return this.connections;
    }

    public getModelDescriptor(): ModelDescriptor{
        return this.modelDescriptor;
    }

    query<T>(): Query<T>{
        return null;
    }
}