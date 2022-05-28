import { TestEntity } from "@fortles/test-utility";
import { MySqlMigrator } from "../src/index.js";
class TestConnection {
    queryString = "";
    query(queryString) {
        this.queryString = queryString;
    }
    toString() {
        return this.queryString;
    }
}
describe("Orm.MySql", function () {
    describe("Migration", function () {
        it("Can create table", function () {
            let connection = new TestConnection();
            let migrator = new MySqlMigrator(connection);
            migrator.create([TestEntity]);
        });
    });
});
//# sourceMappingURL=MySqlMigrator.spec.js.map