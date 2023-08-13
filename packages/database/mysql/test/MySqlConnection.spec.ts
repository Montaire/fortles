import { MySqlDriver } from "../src/index.js";

describe("Orm.MySql.Connection", function(){
    it("Can connect to the database", async function(){
        const driver = new MySqlDriver("default", {
            port: 3307,
            database: "dev_fortles",
            user: "root"
        });
        const connection = await driver.createConnection();
        let result = connection.getNativeConnection().execute("SHOW TABLES");
    });
});