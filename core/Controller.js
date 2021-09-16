const Render = require("./Render.js");
const Auth   = require("./Auth.js");

class Controller{
    constructor(){
    }
    
    eInit(){
        if(Auth.is(this.ePermission)){
            Render.stack.push(this);
            this.eRouted = this.eAction('router');
            return true;
        }else{
            Render.error(403);
            return false;
        }
    }
    
    eAction(action){
        console.log(Render.request);
        var vars = {};
        if(this["_"+action]){
            if(action == "router" || action == "toView"){
                var input = this["_"+action];
                var data = {};
                for(var key in input){
                    if(typeof input[key] == "number"){
                        data[key] = this.eFilter(Render.request.exploded[input[key]]);
                    }else{
                        data[key] = this.eFilter(Render.request.exploded[input[key].POS], input[key].FILTER);
                    }
                }
                console.log(data);
                vars = Object.assign(vars, data);
            }
            return this[action].apply(this, Object.values(vars));
        }else{
            if(action == "router" || action == "toView"){
                if(typeof this[action] === "function"){
                    return this[action]();
                }else{
                    return null;
                }
            }else{
                return 404;
            }
        }
    }
    
    eDrawRouted(name){
        var routed = this.eGetRouted(name);
        if(!routed){
            throw new Error("Add '"+name+"' key to "+this.constructor.name+"'s router function's return array");
        }
        if(routed instanceof Controller){
            return routed.eDraw();
        }else if(typeof routed == "string"){
            return{
                eUri : this.eUri,
                content : Render.view(routed),
                data : this.eView.DATA
            };
        }else{
            throw new Error("In "+this.constructor.name+"'s router: '"+name+"' must be derived from Controller, or string for view, "+typeof routed+" given");
        }
    }
    
    eGetRouted(name){
        if(this.eRouted[name]){
            var routed = this.eRouted[name];
            if(routed instanceof Controller){
                routed.eUri = this.eUri ? this.eUri + "-" + name : name;
            }
            return routed;
        }else{
            return null;
        }
    }
    eDraw(){
        if(this.eInit()){
            var view = this.eAction('toView');
            this.eView(view);
        }
    }
    eView(view){
        for(var key in view){break;}
        if(key.toUpperCase() == key){
            var data = view;
            view = [];
            view.DATA = view;
        }
        if(view === false){
            return;
        }else if(view.VIEW){
            return{
                eUri : this.eUri,
                content : Render.view(view.VIEW),
                data : view.DATA
            };
        }else{
            return this.eDefaultView(view);
        }
        Render.stack.pop();
    }
    eDefaultView(view){
        return{
            eUri : this.eUri,
            content : Render.view(this.constructor.name.substring(0, this.constructor.name.length - 10)),
            data : view.DATA
        };
    }
    eFilter(data, rules){
        rules = rules || /.+/;
        if(rules.test(data)){
            return data;
        }else{
            return null;
        }
    }
};
module.exports = Controller;
