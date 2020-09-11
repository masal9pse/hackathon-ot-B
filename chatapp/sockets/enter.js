'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function(socket, io, master, history, helper) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function(user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベントを送信する
        // 入室したルームに自分のアカウントが既にいた場合は送信しない
        const isnt_in = master[user.name] === undefined;
        if (isnt_in || !Object.values(master[user.name].socketID).includes(user.room)) {
            socket.to(user.room).emit('receiveEntryEvent', user.name);
        }

        // ユーザーを Manager に登録
        if (master[user.name] === undefined) { // まだ登録されていないか
            master.user = user.name;
        }
        // Manager にSocketIDとルーム名を登録
        master[user.name].socketID = {
            id: socket.id,
            room: user.room,
        };

        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');
        db.serialize(function() {
            // データベースからユーザーのログインタイムを取得
            db.get(`select logintime from users where username='${user.name}'`,
                function(err, row) {
                    let date_message = "";
                    if (row.logintime === "illegal_exit") {
                        date_message = "あなたは前回，退出ボタンを押さずに退出しました";
                    } else if (row.logintime === "new_user") {
                        date_message = "何かメッセージを送ってみましょう！";
                    } else {
                        date_message = `あなたが最後にログインしていたのは${row.logintime}です`;
                    }
                    // 自クライアントが受信する入室表示イベントを送信する
                    socket.emit('receiveWelcomeEvent', {
                        name: user.name,
                        date: date_message,
                    });
                    // データベースを閉じる
                    db.close();
                }
            );
        });

        // ユーザー一覧表示機能を実装するため、全ユーザーに送信する。
        io.sockets.emit('AllEntryUserList', master.user);

        // ルームに入室中のユーザーを送信する
        const room_users = Object.keys(master).filter(function (element) {
            return Object.values(master[element].socketID).includes(user.room);
        });
        socket.to(user.room).emit('RoomEntryUserList', room_users);
        socket.emit('RoomEntryUserList', room_users);

        // 各スレッドを初期化
        history.initializeThred(user.name, user.room, io, socket.id, helper);

        console.log(master);
    });
};
