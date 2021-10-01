const [,, ...args] = process.args;

console.log(args);

if(args[0] == 'server'){
    const Server = require('./platform/Server');
    port = args[1] || 8080;
    console.info('Server is started on port ' + port);
    Server.run(port);
}