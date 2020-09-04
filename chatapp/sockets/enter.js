'use strict';

module.exports = function (socket, master) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);
        console.log(`パスワード：${user.pass}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);

        //ユーザーの登録
        master.user = user.name;
        master[user.name].room = user.room;
        master[user.name].socketID = socket.id;
        master[user.name].password = user.pass;

        const sqlite3 = require('sqlite3').verbose();
        // データベースに登録
        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function() {
            db.run("CREATE TABLE IF NOT EXISTS users (username, password, socketid)");
            const stmt = db.prepare("INSERT INTO users VALUES (?, ?, ?)");
            stmt.run(user.name, user.pass, socket.id);
            stmt.finalize();
        });
    });
};
