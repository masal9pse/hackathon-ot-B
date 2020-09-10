'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 0;

module.exports = function (socket, io, master, helper, history) {
    // 投稿メッセージを送信する
    socket.on('dmsendMessageEvent', function (data) {
        if (!data.msg) {
            return;
        }
        console.log("DM!");
        console.log(++helper.num_message);
        console.log(data.date +":" + data.username + "の入力 :" + data.msg);
        // console.log(io.sockets.clients());

        // 自分自身にはbタグをつけた内容を送信
        // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
        Object.keys(master[data.username].socketID)
            .filter((id) => master[data.username].socketID[id] === data.room)
            .forEach((id) => {
                io.to(id).emit("dmreceiveMessageEvent", {
                    "num_message": helper.num_message,
                    "messageid":"dmmessage" + helper.num_message,
                    "username": helper.add_a_tag(data.username, helper.num_message),
                    "date": data.date,
                    "msg": "<b>"+helper.format(data.msg)+"</b>", 
                    "rp_button" : helper.generate_reply(helper.num_message, "dm"),
                    "rm_button": helper.generate_remove(helper.num_message)
                });
            });


        // DMの相手に送信
        io.to(Object.keys(master[data.to_name].socketID)).emit("dmreceiveMessageEvent", {
            "num_message": helper.num_message,
            "messageid":"dmmessage" + helper.num_message,
            "username": helper.add_a_tag(data.username, helper.num_message),
            "date": data.date, 
            "msg": helper.format(data.msg),
            "rp_button" : helper.generate_reply(helper.num_message, "dm"),
            "rm_button": ""
        });

        history.writeHistory(
            helper.num_message,
            "dmmessage",
            data.date,
            "DM",
            data.username,
            data.msg,
            data.to_name
            );

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

    socket.on("initDM" , function(data){
        history.initializeDirectMessage(
            data.my_name,
            data.to_name,
            Object.keys(master[data.to_name].socketID), 
            socket.id, 
            io, 
            helper);
    });
};
