const http = require('http');
const {Render} = require('../core/Render');

class Server{
    static run(port = 8080, mainController = 'MainController'){
        const main = new require(mainController);
        const requestListener = (request, response) => {
            Render.dispatch(main, request, response);
        }

        const server = http.createServer(requestListener);
        server.listen(port);

    }
}
module.exports = Server;