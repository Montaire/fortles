const sqlite3 = require('better-sqlite3');
const fs = require('fs');
const Render = require('./Render.js');

class SQLiteModel{
	public db: any;

    static init(path,inits){
        if(fs.existsSync(path)){
            this.db = new sqlite3(path);
        }else{
            this.db = new sqlite3(path);
            for(var initPath of inits){
                this.db.exec(Render.read(initPath));
            }
        }
    }
    static filter(query, variables, filters, glue, after){
        glue = glue || {
            WHERE: " AND ",
            LIMIT: ", ",
            HAVING:" AND "
        };
        if(!variables){
            return this.db.prepare(query).all();
        }
        if(!filters){
            return this.db.prepare(query).all(variables);
        }
        var filter_query = [];
        for(var key in filters){
            if(typeof filters == "object"){
                var inner_query = [];
                for(var k in filters[key]){
                    if(variables[k] !== undefined && variables[k] !== null && filters[key][k] !== null){
                        inner_query.push(filters[key][k]);
                    }
                }
                if(inner_query.length){
                    filter_query.push(key+" "+inner_query.join(glue[key] || ""));
                }
            }
            if(variables[key] !== undefined && variables[key] !== null){
                filter_query.push(filters[key]);
            }
        }
        //console.log(query+" "+filter_query.join(" ")+(after ? " "+after : ""));
        return this.db.prepare(query+" "+filter_query.join(" ")+(after ? " "+after : "")).all(variables);
    }
}
SQLiteModel.db;

module.exports = SQLiteModel;