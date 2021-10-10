#!/usr/bin/env node
const {Application} = require("essentials");

const [,, ...args] = process.argv;

if(args[0] == 'server'){
    const {ServerPlatform} = require('essentials/platform');
    const port = args[1] || 8080;
    var platform = new ServerPlatform(port);
    console.info('Server is started on port ' + port);
}

const application = new Application(platform);
application.run();