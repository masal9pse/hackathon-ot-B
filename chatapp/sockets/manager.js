"use strict";

const name = Symbol();
const socketid = Symbol();
const logintime = Symbol();
const room = Symbol();

class Manager {

    get user() { //登録されている全ユーザ名を取得
        return Object.keys(this);
    }

    set user(_userName) { //ユーザーの登録
        console.log("Register : " + _userName);
        this[_userName] = new User(_userName);
    }

    deleteUser(_userName) { //ユーザの削除
        try {
            delete this[_userName];
            console.log("Delete : " + _userName);
        } catch (err) {
            console.log("This user doesn't exist");
        }
    }
}

class User {
    constructor(_userName) {
        this[name] = _userName;
    }

    get userName() {
        return this[name];
    }

    set userName(_userName) {
        console.log("Modify : " + this[name] + "→" + _userName);
        this[name] = _userName;
    }

    get socketID() {
        return this[socketid];
    }

    set socketID(_socketID) {
        console.log("Register socket id: " + _socketID);
        this[socketid] = _socketID;
    }

    get LogInTime() {
        return this[logintime];
    }

    set LogInTime(_logInTime) {
        console.log("Register Log In Time: " + _logInTime);
        this[logintime] = _logInTime;
    }

    get room() {
        return this[room];
    }

    set room(_room) {
        console.log("Register entry room: " + _room);
        this[room] = _room;
    }

}

module.exports = Manager;
