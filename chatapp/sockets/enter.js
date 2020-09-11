'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function(socket, io, master, history, helper) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function(user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベントを送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);

        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function() {
            // データベースからユーザーのログインタイムを取得
            db.get(`select logintime from users where username='${user.name}'`,
                function(err, row) {
                    // 自クライアントが受信する入室表示イベントを送信する
                    socket.emit('receiveWelcomeEvent', {
                        name: user.name,
                        date: row.logintime
                    });
                    // データベースを閉じる
                    db.close();
                }
            );
        });

        // ユーザーを Manager に登録
        if (master[user.name] === undefined) { // まだ登録されていないか
            master.user = user.name;
        }

        // Manager にSocketIDとルーム名を登録
        master[user.name].socketID = {
            id: socket.id,
            room: user.room,
        };

        // ユーザー一覧表示機能を実装するため、全ユーザーに送信する。
        io.sockets.emit('receiveEntryUserList', Object.keys(master));

        // ルームに入室中のユーザーを送信する
        socket.to(user.room).emit('receiveRoomEvent', 
            Object.keys(master).filter(function (element) {
                return Object.values(master[element].socketID).includes(user.room);
            })
        );
        socket.emit('receiveRoomEvent', 
            Object.keys(master).filter(function (element) {
                return Object.values(master[element].socketID).includes(user.room);
            })
        );

        console.log(master);

        history.initializeThred(user.name, user.room, io, socket.id, helper);
    });
};
