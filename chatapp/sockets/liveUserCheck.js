'use strict';
const sqlite3 = require('sqlite3').verbose();

module.exports = function(socket, io, master) {
    // disconnect が発火したときに Manager をチェックする
    socket.on('disconnect', function() {
        // Manager を参照して，SocketID が生きているか確認する
        // 死んでいれば削除する
        io.of('/').clients(function(err, living_clients) {
            Object.keys(master).forEach(function(element) {
                Object.keys(master[element].socketID).forEach(function(user_id) {
                    if (!living_clients.includes(user_id)) {
                        const user_room = master[element].socketID[user_id];
                        delete master[element].socketID[user_id];
                        if (Object.keys(master[element].socketID).length === 0) {
                            delete master[element];
                        }
                        // 他クライアントが受信する退室表示イベントを送信する
                        // 退室したルームにまだ自分のアカウントがいる場合は送信しない
                        const isnt_in = master[element] === undefined;
                        if (isnt_in || !Object.values(master[element].socketID).includes(user_room)) {
                            socket.to(user_room).emit('receiveExitEvent', element);
                        }

                        // データベースを新規に開く
                        const db = new sqlite3.Database('./database/usersdb.sqlite');
                        db.serialize(function() {
                            // データベースに退室時間を記録
                            const stmt = db.prepare("update users set logintime=? where username=?");
                            stmt.run("illegal_exit", element);
                            stmt.finalize();

                            db.close();
                        });

                        // ユーザ一覧を全ユーザに送信する
                        io.sockets.emit('AllEntryUserList', master.user);

                        // ルームに入室中のユーザを送信する
                        const room_users = Object.keys(master).filter(function(elem) {
                            return Object.values(master[elem].socketID).includes(user_room);
                        });
                        socket.to(user_room).emit('RoomEntryUserList', room_users);

                        console.log(master);
                    }
                });
            });
        });
    });
}
