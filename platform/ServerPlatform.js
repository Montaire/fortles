const http = require('http');
const {Request, Response} = require('essentials');

class ServerPlatform{

    /**
     * Port of the server
     * @param {number} port 
     */
    constructor(port){
        this.port = port;
    }

    run(application){
        const requestListener = (request, response) => {
            application.dispatch(new ServerRequest(request), new ServerResponse(response));
        }

        const server = http.createServer(requestListener);
        server.listen(this.port);

    }
}

class ServerRequest extends Request{
    /**
     * @param {http.ServerResponse} request 
     */
    constructor(request){

    }
}

class ServerResponse extends Response{
    /**
     * @param {http.ServerResponse} response 
     */
    constructor(response){
        this.response = response;
    }

    write(content){
        this.response.write(content);
    }
}

module.exports = ServerPlatform;