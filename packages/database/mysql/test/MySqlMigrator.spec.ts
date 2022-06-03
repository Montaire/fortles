import { TestEntity } from "@fortles/test-utility";
import { MySqlMigrator } from "../src/index.js";

class TestConnection{
    protected queryString = "";
    query(queryString: string){
        this.queryString = queryString;
    }
    toString(){
        return this.queryString;
    }
}

describe("Orm.MySql", function(){
    describe("Migration", function(){
        it("Can create tables", function(){
            let connection = new TestConnection();
            let migrator = new MySqlMigrator(connection);
            migrator.create([TestEntity]);
        });
    });
});