class Request{
    Type = {
        FULL: 1,
        PARTIAL: 2,
        ACTION: 3
    }
    
    getType(){
        return this.Type.FULL
    }

    getMime(){
        return 'text/html';
    }
}
module.exports = Request;