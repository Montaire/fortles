import { TestEntity } from "../../../model/test/TestEntity.js";
import { MySqlMigrator } from "../index.js";

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
        it("Can create table", function(){
            let connection = new TestConnection();
            let migrator = new MySqlMigrator(connection);
            migrator.create([TestEntity]);
        });
    });
});