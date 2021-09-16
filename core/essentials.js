const ipcRenderer = require('electron').ipcRenderer;
var essentials = (function() {
        var keymap = [];
        var body = document.getElementsByTagName("BODY");
        window.onpopstate= function(e){
            if(e.state){
                essentials.go(e.state.eUri);
            }
        };
    return{
    eUri: function(source){
        var parent = source;
        while(parent = parent.parentElement){
            if(parent.id && parent.id.indexOf("ec-") === 0){
                return parent.id.substring(3);
            }
        }
        return null;
    },
    aGo: function(source, data){
        return this.go(source, source.getAttribute("href"), data);
    },
    go: function(source, uri, data){
         var eUri = this.eUri(source);
         if(window.history && history.pushState){
            this.id("e-feedback").innerHTML = "";
            if(uri == document.location){
                return false;
            }
            ipcRenderer.send("e-update", {
                uri:uri, 
                eUri:eUri,
                data: data || null,
                referer: ''
            });
            return false;
         }else{
             return true;
         }
    },
    action: function(source, action, data, callback){
        callback = callback || this.xhttpSuccess;
        if(action.indexOf(".") === -1){
            action+=".html";
        }
        this.post(document.location.pathname+"$"+this.eUri(source)+"!"+action, callback, this.xhttpError, data);
    },
    html: function(source, action, callback, data){
        this.action(source, action+".html",data,function(xhttp){
           callback(xhttp.responseText); 
        });
    },
    data: function(source, action, callback, data){
        this.action(source, action+".json",data,function(xhttp){
           callback(JSON.parse(xhttp.responseText)); 
        });
    },
    form: function(form){
        //serialize
        var data = {};
        var e = form.getElementsByTagName('input');
        for(var i=0; i<e.length; i++){
            if(e[i].type === 'radio' || e[i].type === 'checkbox'){
                if(e[i].checked){
                    data[e[i].name] = e[i].value;
                }
            }else{
                data[e[i].name] = e[i].value;
            }
        }
        e = form.getElementsByTagName('select');
        for(var i=0; i<e.length; i++){
            if(e[i].options[e[i].selectedIndex]){
                data[e[i].name] = e[i].options[e[i].selectedIndex].value;
            }
        }
        e = form.getElementsByTagName('textarea');
        for(var i=0; i<e.length; i++){
            data[e[i].name] = e[i].value;
        }
        //send
        if(form.method === "post"){
            this.post(form.getAttribute("action")+".html", this.xhttpSuccess,this.xhttpError,data);
        }else if(form.method === "get"){
            
        }
        return false;
    },
    toUrl: function(object){
        var str = [];
        for(var p in object){
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(object[p]));
        }
        return str.join("&");
    },
    id: function(id){
        return document.getElementById(id);
    },
    class: function(name){
        return document.getElementsByClassName(name);
    },
    xhttpError: function(xhttp){
        var feedback = essentials.id("e-feedback");
        feedback.className = "";//reset animation
        void feedback.offsetWidth;
        feedback.innerHTML = xhttp.responseText;
        feedback.className = "e-error";
    },
    xhttpSuccess: function(xhttp){
        var uri = xhttp.getResponseHeader("e-uri");
        if(uri){
            history.pushState({eUri: document.location.pathname}, document.title, uri);
        }
        var focus = xhttp.getResponseHeader("e-focus");
        if(focus){
            this.id(focus).focus();
        }
        var target = xhttp.getResponseHeader("e-target");
        if(target !== null){
            target = target ? essentials.id("ec-"+target) : document.body;
            if(target.parentElement.classList.contains("e-modal")){
                if(xhttp.responseText == ''){
                    target.parentElement.classList.remove("e-active");
                }else{
                    target.parentElement.classList.add("e-active");
                }
            }
            target.innerHTML = xhttp.responseText;
            var scripts = target.getElementsByTagName('script');
            while(scripts[0]){
                var script = document.createElement('script');
                script.innerHTML = scripts[0].innerHTML;
                scripts[0].remove();
                document.body.appendChild(script);
            }
            eReplacer();
        }
        var feedback = xhttp.getResponseHeader("e-feedback");
        if(feedback){
            essentials.feedback(feedback.substring(0,1), JSON.parse(feedback.substring(1)));
        }
    },
    activeId: function(id){
        this.active(essentials.id(id));
    },
    active: function(object){
        object.classList.toggle('active');
    },
    feedback: function(type, message){
        var feedback = essentials.id("e-feedback");
        feedback.innerHTML = message;
        feedback.className = "";//reset animation
        void feedback.offsetWidth;
        switch(type){
            case 'e': feedback.className = "e-error"; break;
            case 'i': feedback.className = "e-info"; break;
            case 'l': feedback.className = "e-load"; break;
            case 'd': feedback.className = "e-done"; break;
        }
    },
    close: function(object, uri_part){
        object.classList.remove("e-active");
        console.log(window.location.href);
    }
};
})();

ipcRenderer.on('e-response', function(e, response){
    if(response.uri){
        history.pushState({eUri: document.location.pathname}, document.title, response.uri);
    }
    if(response.focus){
        essentials.id(response.focus).focus();
    }
    if(response.eUri !== null){
        var target = response.eUri ? essentials.id("ec-"+response.eUri) : document.body;
        if(target.parentElement.classList.contains("e-modal")){
            if(response.content == ''){
                target.parentElement.classList.remove("e-active");
            }else{
                target.parentElement.classList.add("e-active");
            }
        }
        target.innerHTML = "";
        var range = document.createRange();
        target.appendChild(range.createContextualFragment(response.content), target);
    }
    var feedback = target.feedback;
    if(feedback){
        essentials.feedback(feedback.substring(0,1), JSON.parse(feedback.substring(1)));
    }
});