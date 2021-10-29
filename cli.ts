#!/usr/bin/env node
import Application from "./core/Application.js";
import ServerPlatform from "./platform/ServerPlatform.js";

const [,, ...args] = process.argv;

if(args[0] == 'server'){
    const port = args[1] || 8080;
    var platform = new ServerPlatform(port);
    console.info('Server is started on port ' + port);
}

const application = new Application(platform);
application.run();