"use strict";

const name = Symbol();
const socketid = Symbol();
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
        this[socketid] = {};
    }

    get userName() {
        return this[name];
    }

    set userName(_userName) {
        console.log(`Modify : ${this[name]}→${_userName}`);
        this[name] = _userName;
    }

    get socketID() {
        return this[socketid];
    }

    set socketID(_data) {
        console.log(`Register socket id + room: ${_data.id} + ${_data.room}`);
        this[socketid][_data.id] = _data.room;
    }
}

module.exports = Manager;
