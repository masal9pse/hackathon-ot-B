'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function (socket, io, master) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);

        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function() {
            db.get(`select logintime from users where username='${user.name}'`,
                function(err, row) {
                    socket.emit('receiveWelcomeEvent', {
                        name: user.name,
                        date: row.logintime,
                    });
                    db.close();
                }
            );
        });

        //ユーザーの登録
        if (master[user.name] === undefined) {
            master.user = user.name;
        }
        master[user.name].socketID = {
            id: socket.id,
            room: user.room,
        };

        // ユーザー一覧表示機能を実装するため、全ユーザーに送信する。
        io.sockets.emit('receiveEntryUserList', Object.keys(master));

        console.log(master);
    });
};
