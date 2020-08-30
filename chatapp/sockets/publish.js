'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 60;

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if(!data.msg){
            return;
        }

        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        
        io.sockets.emit("BroadcastEvent", {"username": data.username, "date": data.date, "msg": format(data.msg)});

        wait(wait_time, io);　　　　//60秒間投稿禁止

        io.sockets.emit("Ready");     //Readyイベントを発行
    });
};

function format(text){
    let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;"  + text //文の初めは改行し、全角スペース4つ分のインデントをとる

    let formatted_text = pre_text.replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;").replace(blank, "&nbsp;").replace(large_blank, "&emsp;"); //　改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp

    return formatted_text;
}

function wait(time, io){
    let count = time;

    var intervalID = setInterval(() => {    //1秒ごとにカウントダウン
        io.sockets.emit('Pause', count--);   
        console.log(count);
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalID);　
    }, (time+1)*1000);
}
