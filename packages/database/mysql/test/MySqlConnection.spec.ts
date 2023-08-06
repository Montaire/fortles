import { MySqlDriver } from "../src/index.js";

describe("Orm.MySql.Connection", function(){
    it("Can connect to the database", async function(){
        let connection = new MySqlDriver({
            port: 3307,
            database: "dev_fortles",
            user: "root"
        });
        let result = await connection.execute("SHOW TABLES");
    });
});