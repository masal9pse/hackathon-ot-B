'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function (socket, io, master) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function (user) {
        console.log(`退室クライアントのユーザ名：${user.name}`);

        // roomから退室する
        socket.leave(user.room);

        // Managerで管理しているユーザーのSocketIDを削除
        delete master[user.name].socketID[socket.id];
        // もしSocketIDが一つも登録されていなければ，ユーザー自体を削除
        if (Object.keys(master[user.name].socketID).length === 0) {
            delete master[user.name];
        }

        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function () {
            // データベースに退室時間を記録
            const stmt = db.prepare("update users set logintime=? where username=?");
            stmt.run(user.date, user.name);
            stmt.finalize();
        });

        // 他クライアントが受信する退室表示イベント（receiveExitEvent）を送信する
        socket.to(user.room).emit('receiveExitEvent', user.name);

        // ユーザー一覧表示機能を実装するため、全ユーザーに送信する。
        io.sockets.emit('receiveEntryUserList', Object.keys(master));

        console.log(master);
    });
};
