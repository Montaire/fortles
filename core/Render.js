const Uri = require("./Uri.js");
const fs = require("fs");
const ipcMain = require('electron').ipcMain;

class Render{
    static dispatch(main){
        Render.page(main);
        ipcMain.on('e-get-main',function(e){
            var view = Render.mainController.eAction("toView");
            e.returnValue = Render.mainController.eView(view);
        });
        ipcMain.on('e-get-component',function(e, name){
            var controller = Render.stack.top();
            e.returnValue = controller.eDrawRouted(name);
        });
        ipcMain.on('e-update',function(e, request){
            request.exploded = request.uri.substring(1).split("/");
            Render.request = request;
            var response = Render.update(request);
            response.uri = request.uri;
            e.sender.send('e-response', response);
        });
        ipcMain.on('e-action',function(e, request){
            request.exploded = request.uri.substring(1).split("/");
            Render.request = request;
            var response = Render.action(request);
            response.uri = request.uri;
            e.sender.send('e-response', response);
        });
    }
    static update(){
        var eUri = Render.request.eUri.split("-");
        var controller = this.mainController;
        for(var i=0; i<eUri.length; i++){
            if(!controller.eInit()){
                return;
            }
            var request = Render.request;
            Render.request = Render.oldRequest;
            var oldView = controller.eAction("toView", Render.oldRequest);
            Render.request = request;
            var newView = controller.eAction("toView");
            if(JSON.stringify(newView) != JSON.stringify(oldView) || !Render.request.eUri){
                var view = controller.eView(newView);
                view.target = controller.eUri;
                Render.oldRequest = request;
                return view;
            }
            var routed = controller.eRouted;
            controller.eAction("router", Render.oldRequest);
            var oldController = controller.eGetRouted(eUri[i]);
            if(!oldController){
                return;
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
        var view = Render.mainController.eAction("toView");
        return Render.mainController.eView(newView);
    }
    
    static action(){
        var controller = Render.getDirect(Render.mainController);
        if(!controller){
            return;
        }
        var view = controller.eAction(Render.request.action);
        for(var key in view){
            break;
        }
        if(typeof key == "number"){
            Render.error(key, view[key]);
        }else{
            switch(Render.request.extension){
                case "html" : return Render.html(controller, view);
                case "json" : return Render.json(controller, view);
                default: Render.error(400, "Unknown format");
            }
        }
    }
    
    static html(controller, view){
        if(view.hasOwnProperty("UPDATE")){
            if(view.UPDATE === false){
                return;
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
            }
            if(view.GO){
                Render.oldRequest = Render.request.clone();
                Render.request.uri = view.GO;
                Render.request.exploded = Render.request.substring(1).uri.split("/");
                Render.update(Render.mainController);
            }else if(view !== false){
                return controller.eView(controller.eAction("toView"));
            }
        }
    }
    
    static json(view){
        
    }
    
    static getDirect(controller){
        var eUri = Render.request.eUri.split("-");
        for(var name of eUri){
            if(!controller.eInit()){
                return false;
            }
            controller = controller.eGetRouted(name);
            if(!controller){
                Render.error(404);
                return null;
            }
        }
        if(!controller.eInit()){
            return false;
        }
        return controller;
    }
    
    static page(main){
        Render.mainController = main;
        main.eInit();
        Render.stack.push(main);
    }
    
    static view(path){
        let location = "view/"+path+"View.html";
        return fs.readFileSync(location).toString();
    }
    
    static error(number){
        
    }
}
Render.oldRequest = {
    url: '/',
    exploded: []
};
Render.request = Render.oldRequest;
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
    }
};

module.exports = Render;