'use strict';

module.exports = function (socket, master) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (user) {
        console.log('入室クライアントのユーザ名：' + user.name);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);

        //ユーザーの登録
        master.user = user.name;
        master[user.name].room = user.room;
        master[user.name].socketID = socket.id;
    });
/*
    socket.on('entryRoom', function (room) {
        console.log('入室クライアントのルーム：' + room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        // socket.broadcast.emit('receiveRoom', room); => これだと自分以外には表示される。
        socket.emit('receiveRoom', room);
    });
*/
};
