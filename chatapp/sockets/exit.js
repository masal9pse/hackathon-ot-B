'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function(socket, io, master) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function(user) {
        console.log(`退室クライアントのユーザ名：${user.name}`);

        // roomから退室する
        socket.leave(user.room);

        // Managerで管理しているユーザーのSocketIDを削除
        delete master[user.name].socketID[socket.id];
        // もしSocketIDが一つも登録されていなければ，ユーザー自体を削除
        if (Object.keys(master[user.name].socketID).length === 0) {
            delete master[user.name];
        }

        // 他クライアントが受信する退室表示イベントを送信する
        // 退室したルームにまだ自分のアカウントがいる場合は送信しない
        const isnt_in = master[user.name] === undefined;
        if (isnt_in || !Object.values(master[user.name].socketID).includes(user.room)) {
            socket.to(user.room).emit('receiveExitEvent', user.name);
        }

        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function() {
            // データベースに退室時間を記録
            const stmt = db.prepare("update users set logintime=? where username=?");
            stmt.run(user.date, user.name);
            stmt.finalize();

            db.close();
        });

        // ユーザー一覧表示機能を実装するため、全ユーザーに送信する。
        io.sockets.emit('AllEntryUserList', master.user);

        // ルームに入室中のユーザーを送信する
        const room_users = Object.keys(master).filter(function (element) {
            return Object.values(master[element].socketID).includes(user.room);
        });
        socket.to(user.room).emit('RoomEntryUserList', room_users);

        console.log(master);
    });
};
