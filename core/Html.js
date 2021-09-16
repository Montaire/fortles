const ipcRenderer = require('electron').ipcRenderer;
class Html{
    static main(){
        var component = ipcRenderer.sendSync("e-get-main");
        Html.stack.push(component);
        return component.content;
    }
    static component(name, attributes){
        var component = ipcRenderer.sendSync("e-get-component",name);
        Html.stack.push(component);
        if(component.eUri){
            var id = "ec-"+component.eUri+"-"+name;
        }else{
            var id = "ec-"+name;
        }
        Html.write("<div id='"+id+"'"+Html.attributes(attributes)+">"+component.content+"</div>");
        Html.stack.pop(component);
    }
    
    static attributes(attributes){
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
    
    static data(name){
        if(name){
            return Html.stack.top().data[name];
        }else{
            return Html.stack.top().data;
        }
        
    }
    
    static go(url, content, attributes, data){
        Html.write("<a onclick='return essentials.aGo(this"+(data ? (", "+data) : "" )+")'"+Html.attributes(attributes)+" href='"+url+"'>"+content+"</a>");
    }
    static write(content){
        var target = document.currentScript;
        var range = document.createRange();
        target.parentNode.insertBefore(range.createContextualFragment(content), target);
    }
    
};
Html.location = '';

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
        return data.length == 0;
    }
};

module.exports = Html;