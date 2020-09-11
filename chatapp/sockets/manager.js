"use strict";

/*
 * Manager {
 *     User_1: User {
 *         name: 'User_1',
 *         socketid: {
 *             'SocketID_1': 'Room_1',
 *             'SocketID_2': 'Room_2',
 *             'SocketID_3': 'Room_1'
 *         }
 *     },
 *     User_2: User {
 *         name: 'User_2',
 *         socketid: {
 *             'SocketID_4': 'Room_3',
 *             'SocketID_5': 'Room_2'
 *         }
 *     }
 * }
 *
 * Manager は上のような形でユーザーを管理する
 */

const name = Symbol();
const socketid = Symbol();

class Manager {
    get user() { //登録されている全ユーザ名を取得
        return Object.keys(this);
    }

    set user(_userName) { //ユーザーの登録
        console.log("Register : " + _userName);
        this[_userName] = new User(_userName);
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

    /*
     * このセッターには
     * {
     *     id: 'SocketID_1',
     *     room: 'Room_1'
     * }
     * の形でオブジェクトが渡される
     */
    set socketID(_data) {
        console.log(`Register socket id + room: ${_data.id} + ${_data.room}`);
        this[socketid][_data.id] = _data.room;
    }
}

module.exports = Manager;
