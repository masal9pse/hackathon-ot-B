'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 0;

module.exports = function (socket, io) {
    // 投稿メッセージを送信する
    socket.on('sendMessageEvent', function (data) {
        if(!data.msg){
            return;
        }

        console.log(++num_message);
        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        
        socket.broadcast.emit("receiveMessageEvent", {"num_message": num_message, "username": data.username, "date": data.date, "msg": format(data.msg), "rm_button": ""});
        socket.emit("receiveMessageEvent", {"num_message": num_message, "username": data.username, "date": data.date, "msg": "<b>"+format(data.msg)+"</b>", 
        "rm_button":"<input id=remove" + data.num_message + " type='button' value='取り消し' class='common-button room-publish_button' onclick='remove_message(this)';" });

        wait(wait_time, socket, io);　　　　//60秒間投稿禁止

    });

    socket.on("removeMessageEvent", function(id){
        console.log("remove" + id);
        io.sockets.emit("removeElementEvent", id);
    });
};


function format(text){
    let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;"  + text //文の初めは改行し、全角スペース4つ分のインデントをとる

    let formatted_text = pre_text.replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;").replace(blank, "&nbsp;").replace(large_blank, "&emsp;"); //　改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp

    return formatted_text;
}

function wait(time, socket, io){
    let count = time;

    var intervalID = setInterval(() => {    //1秒ごとにカウントダウン
        io.sockets.emit('Pause', count--);   
        console.log(count);
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalID);
        socket.broadcast.emit("Ready");     //Readyイベントを発行　
        socket.emit("Pause", -1);
    }, (time+1)*1000);
}
