'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if(!data){
            return;
        }

        console.log("クライアントの入力 :" + data);

        io.sockets.emit("BroadcastEvent", data);

    });
};
