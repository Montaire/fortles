class Auth{
    static is(group){
        if(!group){
            return true;
        }else{
            return Auth.user.group & group;
        }
    }
    static login(password){
        if(password == "user"){
            Auth.user.group = 0b01;
            return true;
        }else if(password == "admin"){
            Auth.user.group = 0b11;
            return true;
        }else{
            return false;
        }
    }
}
Auth.user = {};
Auth.user.group = 0;
module.exports = Auth;