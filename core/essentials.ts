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
        if(typeof source == "string" || source === null){
            return source;
        }
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
        this.id("e-feedback").innerHTML = "";
        if(uri == Html.history.top().uri){
            return false;
        }
        ipcRenderer.send("e-update", {
            uri:uri, 
            eUri:eUri,
            data: data || null,
            referer: ''
        });
        return false;
    },
    back: function(){
        if( Html.history.length() > 2){
            Html.history.pop();
            var location = Html.history.pop();
            return this.go(location.target, location.uri);
        }else{
            return false;
        }
    },
    action: function(source, action, data){
        ipcRenderer.send("e-action", {
            uri: Html.history.top().uri,
            action: action,
            eUri: this.eUri(source),
            data: data || null,
            extension: 'html'
        });
        return false;
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
    form: function(){
        var form = this;
        //serialize
        var data = {};
        var e = form.getElementsByTagName('input');
        for(var i=0; i<e.length; i++){
            if(e[i].type === 'radio' || e[i].type === 'checkbox'){
                if(e[i].checked){
                    essentials.addToData(data, e[i].name, e[i].value);
                }
            }else{
                essentials.addToData(data, e[i].name, e[i].value);
            }
        }
        e = form.getElementsByTagName('select');
        for(var i=0; i<e.length; i++){
            if(e[i].options[e[i].selectedIndex]){
                essentials.addToData(data, e[i].name, e[i].options[e[i].selectedIndex].value);
            }
        }
        e = form.getElementsByTagName('textarea');
        for(var i=0; i<e.length; i++){
            essentials.addToData(data, e[i].name, e[i].value);
        }
        //send
        // console.log(data);
        ipcRenderer.send("e-action", {
            uri: Html.history.top().uri,
            action: form.getAttribute('action'),
            eUri: essentials.eUri(form),
            data: data || null,
            extension: 'html'
        });
        return false;
    },
    addToData: function(data, name, value){
        if(name.endsWith("[]")){
            name = name.substring(0, name.length-2);
            if(!data[name]){
                data[name] = [value];
            }else{
                data[name].push(value);
            }
        }else{
            data[name] = value;
        }
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
    },
    error(input, message){
        if(!input){
            return;
        }
        if(input.nextElementSibling && input.nextElementSibling.classList.contains("e-error")){
            var error = input.nextElementSibling;
            error.innerHTML = message;
        }else{
            var error = document.createElement("DIV");
            error.innerHTML = message;
            error.classList.add("e-error");
            input.after(error);
        }
        input.addEventListener("onfocus", essentials.errorRemoveHandler);
    },
    errorRemoveHandler: function(){
        if(this.nextElementSibling.classList.contains("e-error")){
            this.nextElementSibling.remove();
        }
    }
};
})();

ipcRenderer.on('e-response', function(e, response){
    // console.log(response);
    if(response.uri && response.uri != Html.history.top().uri){
        Html.history.push({
            uri: response.uri,
            target: response.eUri
        });
    }
    if(response.focus){
        essentials.id(response.focus).focus();
    }
    //if(response.eUri !== null){
        var target = response.eUri ? essentials.id("ec-"+response.eUri) : document.body;
        if(target.parentElement.classList.contains("e-modal")){
            if(response.content == ''){
                target.parentElement.classList.remove("e-active");
            }else{
                target.parentElement.classList.add("e-active");
            }
        }
        if(typeof response.content == "string"){
            target.innerHTML = "";
            Html.stack.clear();
            Html.stack.push(response.controller);
            var range = document.createRange();
            target.appendChild(range.createContextualFragment(response.content), target);
        }
    //}
    var feedback = response.feedback;
    if(feedback){
        essentials.feedback(feedback.substring(0,1), feedback.substring(1));
    }
    var errors = response.error;
    if(errors){
        for(var name in errors){
            if(typeof errors[name] == "object"){
                var inputs = document.getElementsByName(name+"[]");
                for(var index in errors[name]){
                    essentials.error(inputs[index], errors[name][index])
                    
                }
            }else{
                var inputs = document.getElementsByName(name);
                essentials.error(inputs[0], errors[name]);
            }
        }
    }
});