import { Model } from "@fortles/model";
import { MySqlDriver } from "../src/MySqlDriver.js";
import MySqlConnection from "../src/MySqlConnection.js";

describe("Database.MySql.Migration", function(){

    this.beforeAll("Preapre tables", async function(){
        await Model.getInstance().setDriver(new MySqlDriver("default", {
            port: 3306,
            database: "test_fortles",
            user: "root"
        }));
    });

    it("Can create tables", async function(){
        Model.getInstance().migrate();
        const connection = Model.getConnection() as MySqlConnection;
        const result = await connection.getNativeConnection().execute("SHOW TABLES");
        console.log(result);
    });
});