import { Connection, Model } from "./index.js";

export class ModelContext{
    
    protected connectionMap = new Map<string, Connection>();

    public getConnection(name: string = "default"): Connection{
        if(this.connectionMap.has(name)){
            return this.connectionMap.get(name) as Connection;
        }else{
            const connection = Model.getInstance().createConnection(name);
            this.connectionMap.set(name, connection);
            return connection;
        }
    }
}