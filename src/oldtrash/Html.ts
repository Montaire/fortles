const ipcRenderer = require('electron').ipcRenderer;
class Html{
    static async main(){
        ipcRenderer.send("e-get-main");
        ipcRenderer.on('e-set-main', (event, component) => {
            Html.stack.clear();
            Html.stack.push(component.controller);
            Html.history.push({uri: "", target: null});
            document.write(component.content);
            document.currentScript.remove();
        });
    }
    
    static async component(name, attributes){
        ipcRenderer.send("e-get-component",name);
        ipcRenderer.once('e-set-component', (event, component) => {
            console.log(component);
            Html.stack.push(component.controller);
            if(component.eUri){
                var id = "ec-"+component.eUri;
            }else{
                var id = "ec-"+name;
            }
            Html.write("<div id='"+id+"'"+Html.attributes(attributes)+">"+component.content+"</div>");
            Html.stack.pop();
        });
    }
    
    static attributes(attributes?){
        if(!attributes){
            return "";
        }
        if(typeof attributes == "string"){
            return " "+attributes;
        }else{
            var result = "";
            for(var name in attributes){
                result += " " + name + "='"+attributes[name]+"'"
            }
            return result;
        }
    }
    
    static go(url, content, attributes, data){
        return "<a onclick='return essentials.aGo(this"+(data ? (", "+data) : "" )+")'"+Html.attributes(attributes)+" href='"+url+"'>"+content+"</a>";
    }
    
    static back(content, attributes){
        return "<a onclick='return essentials.back()'"+Html.attributes(attributes)+" href=''>"+content+"</a>";
    }
    
    static auth(action, content, unAuth?){
        var controller = Html.stack.top();
        // console.log(controller);
        if(controller["_"+action] && controller["_"+action].AUTH !== undefined && !controller["_"+action].AUTH){
            return unAuth || "";
        }
        return content;
    }
    
    static action(action, content, data, attributes){
        return Html.auth(action, "<a onclick='return essentials.action(this, \""+action+"\""+(data ? (", "+JSON.stringify(data)) : "" )+")'"+Html.attributes(attributes)+" href=''>"+content+"</a>");
    }
    static write(content){
        if(content){
            var target = document.currentScript;
            var range = document.createRange();
            target.parentNode.insertBefore(range.createContextualFragment(content), target);
            target.remove();
        }
    }
    static form(action, attributes, method){
        if(action){
            method = method || "POST";
            return "<form action='"+action+"' method='"+method+"' onsubmit='return eCore.form(this)'"+Html.attributes()+">";
        }else{
            return "</form>";
        }
    }
    
    static tag(tag, value, attributes){
        return "<"+tag+Html.attributes(attributes)+">"+value+"</"+tag+">";
    }
    
    static input(name, attributes){
        var form = document.currentScript.closest("form");
        var controller = Html.stack.top();
        var input = controller["_"+form.getAttribute("action")][name];
        if(!input){
            throw "Implement "+form.getAttribute("action")+" in";
        }
        if(!form.onsubmit){
            form.onsubmit = essentials.form;
        }
        var required = "";// input.EMPTY ? " required" : "";
        if(input.FLAGS & 1){
            name += "[]";
        }
        if(input.OPTIONS){
            var result = "<select name='"+name+"'"+Html.attributes(attributes)+required+"/>";
            if(input.DEFAULT){
                result += "<option value=''>"+input.DEFAULT+"</option>";
            }
            for(var key in input.OPTIONS){
                result += "<option value='"+key+"'"+(key == input.VALUE ? " selected" : "")+">"+input.OPTIONS[key]+"</options>";
            }
            return result + "</select>";
        }else{
            return "<input type='"+(input.TYPE || "text")+"'"+(input.VALUE != undefined ? " value='"+input.VALUE+"'" : "")+" name='"+name+"'"+Html.attributes(attributes)+required+"/>"
        }
    }
    
};
Html.history = {
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
    empty: function(){
        return this.data.length == 0;
    },
    clear: function(){
        return this.data = [];
    },
    length: function(){
        return this.data.length;
    }
};

Html.stack = {
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
    empty: function(){
        return this.data.length == 0;
    },
    clear: function(){
        return this.data = [];
    }
};

module.exports = Html;