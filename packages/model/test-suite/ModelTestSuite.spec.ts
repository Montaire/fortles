import { Migrator } from "../src/index.js";

/**
 * This is a general migration test. All database
 * should pass this test.
 */
export default function migrationTestSuite(){
    let migrator: Migrator;
    describe("General migration", function(){
        before("Build complex model", async function(){
            let path = await import.meta.resolve("../model");
            migrator = new Migrator();
            migrator.run([path]);
        });
        it("Check if the modell is correct", async function(){

        });
        after("Clean up the model", async function(){

        });
    });
}