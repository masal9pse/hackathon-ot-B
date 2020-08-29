'use strict';

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if(!data.msg){
            return;
        }

        console.log(data.date +":" + data.username + "の入力 :" + data.msg);

        io.sockets.emit("BroadcastEvent", data);

    });
};
