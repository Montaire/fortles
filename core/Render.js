const Uri = require("./Uri.js");
const fs = require("fs");
const {ipcMain, app} = require('electron');
const Auth = require("./Auth.js");

class Render{
    static dispatch(main){
        Render.mainController = main;
        ipcMain.on('e-get-main',function(e){
            Render.stack.clear();
            main.eInit();
            var view = Render.mainController.eAction("view");
            e.returnValue = Render.mainController.eView(view);
        });
        ipcMain.on('e-get-component',function(e, name){
            var controller = Render.stack.top();
            e.returnValue = controller.eDrawRouted(name);
        });
        ipcMain.on('e-update',function(e, request){
            Render.feedback = null;
            request.exploded = request.uri.substring(1).split("/");
            Render.request = request;
            var response = Render.update();
            response.uri = request.uri;
            if(Render.feedback){
                response.feedback = Render.feedback;
            }
            e.sender.send('e-response', response);
        });
        ipcMain.on('e-action',function(e, request){
            Render.feedback = null;
            request.exploded = request.uri.substring(1).split("/");
            Render.request = request;
            var response = Render.action();
            response.uri = request.uri;
            if(Render.feedback){
                response.feedback = Render.feedback;
            }
            e.sender.send('e-response', response);
        });
    }
    static update(){
        var eUri = Render.request.eUri ? Render.request.eUri.split("-") : [];
        var controller = this.mainController;
        for(var i=0; i < eUri.length; i++){
            if(!controller.eInit()){
                return;
            }
            var request = Render.request;
            Render.request = Render.oldRequest;
            var oldView = controller.eAction("view");
            var oldRouted = controller.eRouted;
            Render.request = request;
            var newView = controller.eAction("view");
            if(JSON.stringify(newView) != JSON.stringify(oldView) || !Render.request.eUri){
                var view = controller.eView(newView);
                view.target = controller.eUri;
                Render.oldRequest = request;
                return view;
            }
            var routed = controller.eRouted;
            controller.eAction("router");
            var oldController = controller.eGetRouted(eUri[i]);
            if(!oldController){
                return controller.eView(newView);
            }
            for(var name in routed){
                if(JSON.stringify(routed[name]) != JSON.stringify(controller.eRouted[name])){
                    var targetController = controller.eGetRouted(name);
                    var targetView = targetController.eAction("view");
                    var view = targetController.eView(targetView);
                    view.target = targetController.eUri;
                    Render.oldRequest = Render.request;
                    return view;
                }
            }
            controller.eRouted = routed;
            var newController = controller.eGetRouted(eUri[i]);
            if(JSON.stringify(newController) != JSON.stringify(oldController)){
                var view = newController.eView(newView);
                view.target = newController.eUri;
                Render.oldRequest = Render.request;
                return view;
            }
            controller = newController;
        }
        Render.stack.clear();
        Render.mainController.eInit();
        var view = Render.mainController.eAction("view");
        return Render.mainController.eView(view);
    }
    
    static action(){
        var controller = Render.getDirect(Render.mainController);
        if(typeof controller != "object"){
            return Render.error(controller);
        }
        var view = controller.eAction(Render.request.action);
        if(typeof view == "number"){
            return Render.error(view, controller);
        }
        for(var key in view){
            break;
        }
        if(typeof key == "number"){
            return Render.error(key, key[view]);
        }else{
            switch(Render.request.extension){
                case "html" : return Render.html(controller, view);
                case "json" : return Render.json(controller, view);
                default: return Render.error(405, "Unknown format");
            }
        }
    }
    
    static html(controller, view){
        if(view && view.hasOwnProperty("UPDATE")){
            if(view.UPDATE === false){
                return {};
            }else if(typeof view.UPDATE == "number"){
                var parent = Render.stack.getOffset(view.UPDATE);
                if(!parent){
                    throw new Exception("The given offset in "+controller.constructor.name+"'s "+Render.request.action+" action is invalid");
                }else{
                    controller = parent;
                }
            }else if(typeof view.UPDATE == "string"){
                var children = controller.eGetRouted(view.UPDATE);
                if(!children){
                    throw new Exception("The given children in "+controller.constructor.name+"'s "+Render.request.action+" action is invalid");
                }else{
                    controller = children;
                }
            }else if(typeof view.UPDATE == "object"){
                for(var key in view.UPDATE){
                    break;
                }
                controller.eRouted = view.UPDATE;
                var controller = controller.eGetRouted(key);
                return controller.eView(controller.eAction("view"));
            }
        }
        if(view && view.GO){
            Render.oldRequest = Object.assign({}, Render.request);
            Render.request.uri = view.GO;
            Render.request.exploded = Render.request.uri.substring(1).split("/");
            return Render.update();
        }else if(view !== false){
            return controller.eView(controller.eAction("view"));
        }
    }
    
    static json(controller, view){
        if(typeof view == "number"){
            return Render.error(view, controller);
        }else if(view.JSON){
            return view.JSON;                    
        }else if (view.DATA){
            return JSON.stringify(view.DATA);
        }else{
            return '{}';
        }
    }
    
    static getDirect(controller){
        if(!Render.request.eUri){
            return controller;
        }
        var eUri = Render.request.eUri.split("-");
        for(var name of eUri){
            if(!controller.eInit()){
                return false;
            }
            controller = controller.eGetRouted(name);
            if(!controller){
                return 404;
            }
        }
        if(!controller.eInit()){
            return 401;
        }
        return controller;
    }
    
    static view(path, variables){
        return Render.filePreprocessor(Render.read("/view/"+path+".html"), variables);
    }
    
    static filePreprocessor(content, variables){
        console.log(variables);
        if(typeof content == "string"){
            content = content.replace(/<e:for (.+?) : (.+?) ?>([^]*)<\/e:for>/g, function(match, valueField, dataField, innerContent){;
                var result = "";
                var path = dataField.split(".");
                var variable = variables;
                for(var key in path){
                    variable = variable[path[key]];
                }
                for(var key in variable){
                    variables[valueField] = variable[key];
                    result += Render.filePreprocessor(innerContent, variables);
                }
                return result;
            });
            content = content.replace(/<e:go(.+?)(?:auth="(.*?)")?.*?href="(.*?)"(.*?)>([^]*?)<\/e:go>/g,function(match, before, auth, href, after, content){
                var controller = Render.stack.top();
                if(auth && controller["_"+auth] && controller["_"+auth].AUTH !== undefined && !controller["_"+auth].AUTH){
                    return '<div' + before + after + ">" + content + "</div>";
                }else {
                    return '<a onclick="return essentials.aGo(this)"' + before + ' href="' + Render.replaceVariables(href, variables, true) + '"' + after + ">" + content + "</a>";
                }
            });
            return Render.replaceCode(content, variables);
        }
        return content;
    }
    
    static replaceVariables(string, variables, string_literal){
        return string.replace(/\$([a-zA-Z._]+)/g,function(match, name){
            var path = name.split(".");
            var result = variables;
            for(var key in path){
                if(!result){
                    return null;
                }
                result = result[path[key]];
            }
            switch(typeof result){
                case "string": return string_literal ? result : '"'+result+'"';
                case "object": return JSON.stringify(result);
                default: return result;
            }
        });
    }
    
    static replaceCode(content, variables){
        return content.replace(/{{([^]+?)}}|<script>([^]+?)<\/script>/g, function(match, echoScript, script){
            if(echoScript){
                echoScript = Render.replaceVariables(echoScript, variables);
                return '<script>Html.write('+echoScript+')</script>';
            }
            if(script){
                return '<script>' + Render.replaceVariables(script, variables) + '</script>';
            }
        });
    }
    
    static error(number, data){
        var result = {status: number};
        if(!data){
            
        }else if(typeof data == "string"){
            result.feedback = "e"+data;
        }else{
            if(data.eError){
                result.error = data.eError;
            }
        }
        return result;
    }
    
    static read(path){
        return fs.readFileSync(app.getAppPath() + path).toString();
    }
}
Render.oldRequest = {
    url: '/',
    exploded: []
};
Render.request = Render.oldRequest;
Render.feedback = null;
Render.stack = {
    data: [],
    top: function(){
        return this.data[this.data.length - 1];
    },
    push: function(data){
        this.data.push(data);
    },
    pop: function(){
        return this.data.pop();
    },
    clear: function(){
        return this.data = [];
    }
};

module.exports = Render;
