const Render = require("./Render.js");
const Auth   = require("./Auth.js");
const Filter   = require("./Filter.js");

class Controller{

    eInit(){
        if(Auth.is(this.eAuthGroup)){
            Render.stack.push(this);
            this.eRouted = this.eAction('router');
            this.eError = null;
            return true;
        }else{
            return false;
        }
    }
    
    eAction(action){
        var vars = {};
        if(this["_"+action]){
            var input = this["_"+action];
            if(input.AUTH !== undefined){
                if(!input.AUTH){
                    return 402;
                }
                delete input.AUTH;
            }
            var data = {};
            var length = 0;
            if(Controller.viewActions.includes(action)){
                for(var name in input){
                    if(typeof input[name] == "number"){
                        data[name] = this.eFilter(name, Render.request.exploded[input[name]]);
                    }else if(input[name].POS){
                        data[name] = this.eFilter(name, Render.request.exploded[input[name].POS], input[name]);
                    }else if(input[name].FILTER && Render.request.data){
                        data[name] = this.eFilter(name, Render.request.data[name], input[name]);
                    }else{
                        data[name] = null;
                    }
                    length++;
                }
            }else{
                for(var name in input){
                    if(input[name].FILTER){
                        data[name] = this.eFilter(name, Render.request.data[name], input[name]);
                    }else{
                        data[name] = this.eFilter(name, Render.request.data[name], {FILTER:input[name]});
                    }
                    length++;
                }
            }
            vars = Object.assign(vars, data);
            if(this.eError){
                return 403;
            }else{
                if(length > 1 && this[action].toString().match(/\(.*?\)/)[0].indexOf(",") == -1){
                    var view = this[action].call(this, vars);
                }else{
                    var view = this[action].apply(this, Object.values(vars));
                }
                if(view){
                    if(view.FEEDBACK_DONE || view.DONE){
                        Render.feedback = "d" + (view.FEEDBACK_DONE || view.DONE);
                    }else if(view.FEEDBACK_ERROR){
                        Render.feedback = "e" + view.FEEDBACK_ERROR;
                    }else if(view.FEEDBACK_INFO || view.INFO){
                        Render.feedback = "i" + (view.FEEDBACK_INFO || view.INFO);
                    }else if(view.ERROR){
                        Render.feedback = "e" + view.ERROR;
                        return 403;
                    }
                    if(view.VALUES){
                        for(var key in view.VALUES){
                            for(var name in view.VALUES[key]){
                                if(this["_"+key] && this["_"+key][name]){
                                    this["_"+key][name].VALUE = view.VALUES[key][name];
                                }
                            }
                        }
                    }
                }
                return view;
            }
        }else{
            if(Controller.viewActions.includes(action)){
                if(typeof this[action] === "function"){
                    var view = this[action]();
                    if(view && view.VALUES){
                        for(var key in view.VALUES){
                            for(var name in view.VALUES[key]){
                                if(this["_"+key] && this["_"+key][name]){
                                    this["_"+key][name].VALUE = view.VALUES[key][name];
                                }
                            }
                        }
                    }
                    return view;
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
                content : Render.view(routed, this.eView && this.eView.DATA),
                controller: this
            };
        }else{
            throw new Error("In "+this.constructor.name+"'s router: '"+name+"' must be derived from Controller, or string for view, "+typeof routed+" given");
        }
    }
    
    eGetRouted(name){
        if(this.eRouted && this.eRouted[name]){
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
            var view = this.eAction('view');
            return this.eView(view);
        }
    }
    eView(view){
        if(!view){
            return this.eDefaultView();
        }
        for(var key in view){break;}
        if(key && key.toUpperCase() != key){
            var data = view;
            view = {};
            view.DATA = data;
        }
        if(view === false){
            return;
        }else if(view && view.VIEW){
            return this.eResponse(view, view.VIEW);
        }else{
            return this.eDefaultView(view);
        }
    }
    eDefaultView(view){
        return this.eResponse(view, this.constructor.name.substring(0, this.constructor.name.length - 10));
    }
    eResponse(view, content){
        return{
            eUri : this.eUri || null,
            content : Render.view(content, view && view.DATA),
            controller: this
        };
    }
    eFilter(name, data, input){
        input = input || {FILTER:/.*/};
        if(input.FLAGS & 1){
            if(input.EMPTY && !data){
                if(!this.eError){
                    this.eError = {};
                }
                this.eError[name] = input.EMPTY || Filter.EMPTY_MESSAGE;
                return null;
            }
            var valid = true;
            for(var key in data){
                if(!data[key] && data[key] !== false){
                    if(input.EMPTY || input.EMPTY === false){
                        if(!this.eError){
                            this.eError = {};
                        }
                        if(!this.eError[name]){
                            this.eError[name] = {};
                        }
                        this.eError[name][key] = input.EMPTY || Filter.EMPTY_MESSAGE;
                        valid = false;
                    }else{
                        data[key] = null;
                    }
                }else if(!input.FILTER.test(data[key])){
                    if(!this.eError){
                        this.eError = {};
                    }
                    if(!this.eError[name]){
                        this.eError[name] = {};
                    }
                    this.eError[name][key] = input.INVALID || Filter.INVALID_MESSAGE;
                    valid = false;
                }
            }
            if(valid){
                return data;
            }else{
                return false;
            }
        }
        if((!data && data !== false)){
            if(input.EMPTY || input.EMPTY === false){
                if(!this.eError){
                    this.eError = {};
                }
                this.eError[name] = input.EMPTY || Filter.EMPTY_MESSAGE;
            }
            return null;
        }else if(input.FILTER.test(data)){
            return data;
        }else{
            if(!this.eError){
                this.eError = {};
            }
            this.eError[name] = input.INVALID || Filter.INVALID_MESSAGE;
            return false;
        }
    }
};
Controller.viewActions = [
    'view', 'router'
];
module.exports = Controller;
