#!/usr/bin/env node
import Application from "./core/Application.js";
import ServerPlatform from "./platform/ServerPlatform.js";

const [,, ...args] = process.argv;

//if(args[0] == 'server'){
    const port = args[1] || 8080;
    var platform = new ServerPlatform(port as number);
    console.info('Server is started on port ' + port);
//}

//try{
    
/*}catch(error){
    if(error.code == 'MODULE_NOT_FOUND'){
        throw new Error('You have to create a MainController class in your controller directory as your entry point.');
    }else{
        throw error;
    }
}*/

//const application = new Application(mainController, platform);
//gapplication.run();