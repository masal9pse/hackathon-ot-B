'use strict';

module.exports = function (socket, io, master) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);
        io.sockets.to(user.room).emit('receiveEntryEvent2', user.name);

        //ユーザーの登録
        master.user = user.name;
        console.log(master.user);
        master[user.name].room = user.room;
        master[user.name].socketID = socket.id;
        socket.to(user.room).emit('receiveEntryEvent', user.name);
    });
};
