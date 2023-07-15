import { Connection, ModelDescriptor, Query, Migartor, Entity } from "./index.js";


export class Model{

    protected modelDescriptor: ModelDescriptor;
    protected connections: Map<string, Connection>;
    protected defaultConnection: Connection;

    constructor(modelDescriptor: ModelDescriptor = new ModelDescriptor(), connections = new  Map<string, Connection>()){
        this.modelDescriptor = modelDescriptor;
        this.connections = connections;
        if(connections.has("default")){
            this.defaultConnection = connections.get("default") as Connection;
        }else{
            throw Error("Default connection must be defined.");
        }
    }

    public migrate(): void{
        const migrator = new Migartor(this);
        migrator.migrate();
    }

    public getConnections(): Map<string, Connection>{
        return this.connections;
    }

    public setConnection(name: string, connection: Connection): void{
        this.connections.set(name, connection);
    }

    public setDefaultConnection(name: string){
        if(this.connections.has(name)){
            this.defaultConnection = this.connections.get(name) as Connection;
        }else{
            throw Error("The model does not knoe about " + name + ". Set this connection before set it to default.");
        }
    }

    public static getConnection(name?: string): Connection{
        if(!name){
            return this.getInstance().getConnection(name);
        }
        return this.getInstance().defaultConnection;
    }

    public getConnection(name?: string): Connection{
        if(name){
            const connection =  this.connections.get(name);
            if(!connection){
                return this.defaultConnection;
            }
        }
        return this.defaultConnection;
    }

    public getModelDescriptor(): ModelDescriptor{
        return this.modelDescriptor;
    }

    public static getInstance(): Model{
        return new Model();
    }
}