'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if(!data.msg){
            return;
        }

        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        
        io.sockets.emit("BroadcastEvent", {"username": data.username, "date": data.date, "msg": format(data.msg)});
        socket.emit('Pause-minute', 60);   //60秒間投稿禁止
    });
};

function format(text){
    let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;"  + text //文の初めは改行し、全角スペース4つ分のインデントをとる

    let formatted_text = pre_text.replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;").replace(blank, "&nbsp;").replace(large_blank, "&emsp;"); //　改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp

    return formatted_text;
}
