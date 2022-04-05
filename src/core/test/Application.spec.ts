import TestUtility, { TestRequest } from "@fortles/test-utility";
import { Application, Controller, RequestType } from "@fortles/core";

import assert from "assert";

describe("Application", function(){
    describe("Update mechanism", function(){
        it("Handles menu change with templates", function(){
            let templates = [
                TestUtility.createTemplate("<f:block name='nav'/><f:block name='content'/>", ".Main"),
                TestUtility.createTemplate("menu", "menu"),
                TestUtility.createTemplate("home", "home"),
                TestUtility.createTemplate("about-us", "about-us"),
            ];
            let mainController = new Controller();
            mainController.getRouter()
                .createDefaultRoute("Main")
                    .addTemplate("nav", "menu")
                    .addTemplate("content", "home");
            mainController.getRouter() //Injex template name, as path of the controller not available here.
                .createRoute("about-us", ".Main")
                    .addTemplate("content", "about-us");
            let application = TestUtility.createServerApplication(mainController, templates);

            assert.equal(
                application.simulate(new TestRequest()).getBody(), 
                "<div id=\"f-block-nav\">menu</div><div id=\"f-block-content\">home</div>", 
                "Home page not correct!"
            );

            assert.equal(
                application.simulate(new TestRequest("/about-us")).getBody(),
                "<div id=\"f-block-nav\">menu</div><div id=\"f-block-content\">about-us</div>",
                "About-us page not correct!"
            );

            let request = new TestRequest("/about-us", RequestType.PARTIAL);
            request.referer = "";
            request.blockPath = "menu"
            let response = application.simulate(request);

            assert.equal(
                response.getBody(), 
                "about-us",
                "Partial request not correct!"
            );
            
            assert.equal(
                response.blockPath,
                "content",
                "Target is not properly set!"
            );
        });
        it("Handles menu change with controllers", function(){

        });
    });
});