import { Connection, Driver, Model } from "./index.js";

export class ModelContext{
    
    protected connectionMap = new Map<string, Connection>();

    public getConnection(driverName: string = "default"): Connection{
        if(this.connectionMap.has(driverName)){
            return this.connectionMap.get(driverName) as Connection;
        }else{
            throw Error("Connection \"" + driverName + "\" was not found!");
        }
    }

    public async createConnection(driver: Driver): Promise<void>{
        const connection = await driver.createConnection();
        this.connectionMap.set(driver.getName(), connection);
    }
}