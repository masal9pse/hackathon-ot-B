'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 0;
require('./helper');

module.exports = function (socket, io, master, helper) {
    // 投稿メッセージを送信する
    socket.on('tlsendMessageEvent', function (data) {
        if (!data.msg) {
            return;
        }

        console.log(++helper.num_message);
        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        // console.log(io.sockets.clients());

        // 自分自身にはbタグをつけた内容を送信
        // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
        Object.keys(master[data.username].socketID)
            .filter((id) => master[data.username].socketID[id] === data.room)
            .forEach((id) => {
                io.to(id).emit("tlreceiveMessageEvent", {
                    "num_message": helper.num_message,
                    "username": helper.add_a_tag(data.username, helper.num_message, "tl"),
                    "date": data.date,
                    "msg": "<b>"+helper.format(data.msg)+"</b>", 
                    "rp_button" : helper.generate_reply(helper.num_message, "tl"),
                    "rm_button": helper.generate_remove(helper.num_message)
                });
            });

        // 他のクライアントには普通に送信
        // 未実装：チャットルーム内の自分のアカウントには送信しない
        // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
        socket.broadcast.to(data.room).emit("tlreceiveMessageEvent", {
            "num_message": helper.num_message,
            "username": helper.add_a_tag(data.username, helper.num_message, "tl"),
            "date": data.date, 
            "msg": helper.format(data.msg),
            "rp_button" : helper.generate_reply(helper.num_message, "tl"),
            "rm_button": ""
        });

        wait(helper.wait_time, socket, io);　　　　//60秒間投稿禁止

    });


    // リプライイベントを送信する
    socket.on("tlreplyMessageEvent", function (data) {
        console.log(++helper.num_message);
        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        // console.log(io.sockets.clients());
        
        let to_reply = String(data.reply).replace("@", "").replace("\n", "");

        // 自分自身にはbタグをつけた内容を送信
        // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
        Object.keys(master[data.username].socketID)
            .filter((id) => master[data.username].socketID[id] === data.room)
            .forEach((id) => {
                socket.to(id).emit("tlreceiveReplyMessage", {
                    "num_message": helper.num_message,
                    "reply": to_reply,
                    "username": helper.add_a_tag(data.username, helper.num_message, "tl"),
                    "date": data.date,
                    "msg": "<b>"+helper.format(data.msg)+"</b>", 
                    "rp_button" : helper.generate_reply(helper.num_message, "tl"),
                    "rm_button": helper.generate_remove(helper.num_message)
                });
            });

        // 他のクライアントには普通に送信
        // 未実装：チャットルーム内の自分のアカウントには送信しない
        // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
        socket.broadcast.to(data.room).emit("tlreceiveReplyMessage", {
            "area" : data.area,
            "num_message": helper.num_message,
            "reply": to_reply,
            "username": helper.add_a_tag(data.username, helper.num_message, "tl"),
            "date": data.date, 
            "msg": helper.format(data.msg),
            "rp_button" : helper.generate_reply(helper.num_message, "tl"),
            "rm_button": ""
        });

        // wait(wait_time, socket, io);　　　　//60秒間投稿禁止

    });

    // メモイベントを送信する
    socket.on("sendtlMemoEvent", function (data) {
        Object.keys(master[data.user].socketID).forEach((id) => {
            io.to(id).emit("receivetlMemoEvent", {
                user: data.user,
                msg:  data.msg,
                date: data.date,
            });
        });
    });

    // メッセージ削除イベントを送信する
    socket.on("removeMessageEvent", function (id) {
        console.log("remove" + id);
        io.sockets.emit("removeElementEvent", id);
    });
};

//待機する関数
function wait(time, socket, io) {
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
