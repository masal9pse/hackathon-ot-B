'use strict';

module.exports = function (socket, master) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (user) {
        console.log(`入室クライアントのユーザ名：${user.name}`);

        // roomへ入室する
        socket.join(user.room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.to(user.room).emit('receiveEntryEvent', user.name);

        //ユーザーの登録
        if (master[user.name] === undefined) {
            master.user = user.name;
        }
        master[user.name].room = user.room;
        master[user.name].socketID = socket.id;

        console.log(master);
    });
};
