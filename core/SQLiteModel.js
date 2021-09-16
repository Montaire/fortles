const sqlite3 = require('sqlite3').verbose();

class SQLiteModel{
    static init(path){
        this.db = new sqlite3.Database(path);
    }
    
    static condition(condition, glue){
        var what = '';
        if(typeof condition == "array"){
            for(var key in condition){
                if(!what){
                    what = what + glue;
                }
                if(typeof key == "number"){
                    what += condition[key];
                    delete condition[key];
                }else{
                    what += key + "= ?";
                }
            }
            condition = array_values(condition);
        }else{
            what = condition;
        }
        return what;
    }
    
    static field(fields){
        if(fields == null){
            return '*';
        }else if(typeof fields == "array"){
            $field = '';
            for(var key in fields){
                if($field){
                    $field += ', ';
                }
                if(typeof key == "number"){
                    $field += field[key];
                }else{
                    $field += field[key] +" "+key;
                }
            }
            return $field;
        }else{
            return fields;
        }
    }
    
    static select(fields, table, condition){
        var f = this.field(fields);
        var c = this.condition(condition, ' AND ');
        var stmt = this.db.prepare("SELECT "+f+" FROM "+ table + (condition ? " WHERE "+c : ''));
        stmt.run(condition);
        return stmt;
    }
    
    static update(values, table, condition){
        var f = this.condition(values, ', ');
        var c = this.condition(condition, ' AND ');
        var stmt = this.db.prepare("UPDATE "+table+" SET "+f+" WHERE "+c);
        stmt.run(array_merge(values, condition));
        return stmt;
    }
    
    static insert(table, values){
        var keys = Object.keys(values);
        var v = keys.join();
        var v2= keys.join(",:");
        var stmt = this.db.prepare("INSERT INTO "+table+" ("+v+") VALUES (:"+v2+")");
        return stmt.run(values);
    }
    
    static delete(table, condition){
        var c = this.condition(condition, ' AND ');
        var stmt = this.db.prepare("DELETE FROM "+table+" WHERE "+c);
        return stmt.run(condition);
    }
};

SQLiteModel.db;

module.exports = SQLiteModel;