import { Model } from "@fortles/model";
import { TestDriver } from "@fortles/model/test/utility/TestDriver.js";

describe("Orm.MySql.Migration", function(){

    this.beforeAll("Preapre tables", function(){
        Model.getInstance().setDriver(new TestDriver());
    });

    it("Can create tables", function(){
        Model.getInstance().migrate();
    });
});