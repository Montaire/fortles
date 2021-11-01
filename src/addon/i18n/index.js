const NodeGettext = require('node-gettext');
const {po} = require('gettext-parser');
const fs = require('fs');
const app = require('electron').app || require('electron').remote && require('electron').remote.app;

var i18n = {
    __: function(msgid, vars){
        var message = i18n.nodeGettext.gettext(msgid);
        if(vars){
            if(typeof vars == "array" || typeof vars == "object"){
                for(var key in vars){
                    message = message.replace("{"+key+"}", vars[key]);
                }
            }else{
                for(var i=1; i < arguments.length; i++){
                    message = message.replace("{"+(i-1)+"}", arguments[i]);
                }
            }
        }
        return message;
    },
    gettext:{
        loadLanguageFile: function(locale, domain, path){
            domain = domain || "messages";
            path = path || "/language/"+locale+".po";
            var basepath = app ? app.getAppPath() : __dirname;
            file = fs.readFileSync(basepath + path);
            i18n.nodeGettext.addTranslations(locale, domain, po.parse(file));
        },
        setLocale: function(locale){
            i18n.nodeGettext.setLocale(locale);
        }
    }
};
i18n.nodeGettext = i18n.nodeGettext || new NodeGettext(),
module.exports = i18n;
