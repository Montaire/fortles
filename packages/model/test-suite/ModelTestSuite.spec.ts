/**
 * This is a general migration test. All database
 * should pass this test.
 */
export default function migrationTestSuite(){
    //let migrator: Migrator;
    describe("General migration", function(){
        before("Build complex model", async function(){
            let path = await import.meta.resolve("../model");
            throw new Error("Not implemented");
        });
        it("Check if the modell is correct", async function(){

        });
        after("Clean up the model", async function(){

        });
    });
}