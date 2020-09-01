'use strict';

module.exports = function (socket) {
    // 退室メッセージをクライアントに送信する
    socket.on('exitMyselfEvent', function (user) {
        console.log('退室クライアントのユーザ名：' + user.name);

        // 他クライアントが受信する退室表示イベント（receiveExitEvent）を送信する
        socket.to(user.room).emit('receiveExitEvent', user.name);
    });
};
