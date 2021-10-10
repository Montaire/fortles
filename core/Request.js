class Request{
    static Type = {
        FULL: 1,
        PARTIAL: 2,
        ACTION: 3
    }
    
    getType(){
        return Request.Type.FULL
    }

    getMime(){
        return 'text/html';
    }
}
module.exports = Request;