import { Application, Controller, Platform } from "../index.js";

let application: Application;

it.skip("Creates a new Application", function(){
    let platform = new Platform();
    let mainController = new Controller();
    application = new Application(platform, mainController);
});