class Uri{
	public extension: any;
	public action: any;
	public eUri: any;
	public route: any;
	public exploded: any;
	public referer: any;

    constructor(){
        var request = "";
        var end;
        
        var dot = request.lastIndexOf(".");
        if(dot !== -1){
            this.extension = request.substring(dot+1);
            end = dot;
        }
        
        var exclamination = request.lastIndexOf("!");
        if(exclamination !== -1){
            if(end){
                this.action = request.substring(exclamination + 1, end-1 - exclamination);
            }else{
                this.action = request.substring(exclamination+1);
            }
            end = exclamination;
        }
        
        var dollar = request.lastIndexOf("$");
        if(dollar){
            if(end){
                this.eUri = request.substring(dollar+1, end-1 - dollar);
            }else{
                this.eUri = request.substring(dollar+1);
            }
            end = dollar;
        }
        this.route = request;
        this.exploded = request.split("/");
        this.referer = null;
    }
};

module.exports = Uri;