import TestUtility, { TestRequest } from "@fortles/test-utility";
import assert from "assert";
import { Application, Controller } from "../index.js";

let application: Application;

describe("Application", function(){
    describe("Update mechanism", function(){
        it("Handles menu change with templates", function(){
            let assets = [
                TestUtility.createTemplate("menu ", "menu"),
                TestUtility.createTemplate("home", "home"),
                TestUtility.createTemplate("about-us", "about-us"),
            ];
            let mainController = new Controller();
            mainController.getRouter()
                .createDefaultRoute()
                    .addTemplate("menu", "menu")
                    .addTemplate("content", "home");
            mainController.getRouter()
                .createTemplatedRoute("about-us")
                    .addTemplate("content", "about-us");

            let response = TestUtility.simulateRequest(new TestRequest());
            assert.equal(response.toString(), "menu home");
            
        });
        it("Handles menu change with templates", function(){

        });
    });
});