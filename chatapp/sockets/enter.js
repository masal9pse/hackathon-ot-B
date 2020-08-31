'use strict';

module.exports = function (socket) {
    // 入室メッセージをクライアントに送信する
    socket.on('entryMyselfEvent', function (userName) {
        console.log('入室クライアントのユーザ名：' + userName);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.emit('receiveEntryEvent', userName);
    });

    socket.on('entryRoom', function (room) {
        console.log('入室クライアントのルーム：' + room);

        // 他クライアントが受信する入室表示イベント（receiveEntryEvent）を送信する
        socket.emit('receiveRoom', room);
    });
};
