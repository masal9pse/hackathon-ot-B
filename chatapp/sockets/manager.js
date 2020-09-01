"use strict";

const name = Symbol();
const soketid = Symbol();
const logintime = Symbol();

class Manager{

    get user(){                   //登録されている全ユーザ名を取得
        return Object.keys(this);
    }

    set user(_userName){　　　　　　//ユーザーの登録
        console.log("Register : " + _userName);
        this[_userName] = new User(_userName);
    }

    deleteUser(_userName){       //ユーザの削除
        try{
            delete this[_userName];
            console.log("Delete : " + _userName);
            return true;
        }catch(err){
            console.log("This user doesn't exist");
            return false;
        }
    }
}

class User{
    constructor(_userName){
        this[name] = _userName;
    }

    get userName(){
        return this[name];
    }

    set userName(_userName){
        console.log("Modify : " + this[name] + "→" + _userName);
        this[name] = _userName;
    }

    get soketID(){
        return this[soketid];
    }

    set soketID(_soketID){
        console.log("Register soket id: " + _soketID);
        this[soketid] = _soketID;
    }

    get LogInTime(){
        return this[logintime];
    }

    set LogInTime(_logInTime){
        console.log("Register Log In Time: " + _logInTime);
        this[logintime] = _logInTime;
    }

}

module.exports = Manager;