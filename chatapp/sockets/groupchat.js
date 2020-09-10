'use strict';

module.exports = function(socket, io, master, helper, history) {
    // 投稿メッセージを送信する
    socket.on('grsendMessageEvent', function(data) {
        if (!data.msg) {
            return;
        }

        console.log(++helper.num_message);
        console.log(data.date + ":" + data.username + "の入力 :" + data.msg);
        // console.log(io.sockets.clients());

        // 自分自身にはbタグをつけた内容を送信
        // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
        Object.keys(master[data.username].socketID)
            .filter((id) => master[data.username].socketID[id] === data.room)
            .forEach((id) => {
                io.to(id).emit("grreceiveMessageEvent", {
                    "num_message": helper.num_message,
                    "messageid":"grmessage" + helper.num_message,
                    "username": helper.add_a_tag(data.username, helper.num_message),
                    "date": data.date,
                    "msg": "<b>" + helper.format(data.msg) + "</b>",
                    "rp_button": helper.generate_reply(helper.num_message, "gr"),
                    "rm_button": helper.generate_remove(helper.num_message)
                });
            });

        // 他のクライアントには普通に送信
        // 未実装：チャットルーム内の自分のアカウントには送信しない
        // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
        socket.broadcast.to(data.room).emit("grreceiveMessageEvent", {
            "num_message": helper.num_message,
            "messageid":"grmessage" + helper.num_message,
            "username": helper.add_a_tag(data.username, helper.num_message),
            "date": data.date,
            "msg": helper.format(data.msg),
            "rp_button": helper.generate_reply(helper.num_message, "gr"),
            "rm_button": ""
        });

        console.log(master[data.username].socketID[socket.id]);

        history.writeHistory(
            helper.num_message,
            "grmessage",
            data.date,
            master[data.username].socketID[socket.id],
            data.username,
            data.msg,
            '0'
            );

    });


    // リプライイベントを送信する
    socket.on("grreplyMessageEvent", function(data) {
        console.log(++helper.num_message);
        console.log(data.date + ":" + data.username + "の入力 :" + data.msg);
        // console.log(io.sockets.clients());

        let to_reply = String(data.reply).replace("@", "").replace("\n", "");

        // 自分自身にはbタグをつけた内容を送信
        // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
        Object.keys(master[data.username].socketID)
            .filter((id) => master[data.username].socketID[id] === data.room)
            .forEach((id) => {
                io.to(id).emit("grreceiveReplyMessage", {
                    "num_message": helper.num_message,
                    "messageid":"reply" + helper.num_message,
                    "reply": to_reply,
                    "username": helper.add_a_tag(data.username, helper.num_message),
                    "date": data.date,
                    "msg": "<b>" + helper.format(data.msg) + "</b>",
                    "rp_button": helper.generate_reply(helper.num_message, "gr"),
                    "rm_button": helper.generate_remove(helper.num_message)
                });
            });

        // 他のクライアントには普通に送信
        // 未実装：チャットルーム内の自分のアカウントには送信しない
        // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
        socket.broadcast.to(data.room).emit("grreceiveReplyMessage", {
            "num_message": helper.num_message,
            "messageid":"reply" + helper.num_message,
            "reply": to_reply,
            "username": helper.add_a_tag(data.username, helper.num_message),
            "date": data.date,
            "msg": helper.format(data.msg),
            "rp_button": helper.generate_reply(helper.num_message, "gr"),
            "rm_button": ""
        });
    });

    // メッセージ削除イベントを送信する
    socket.on("removeMessageEvent", function(id) {
        console.log("remove" + id);
        io.sockets.emit("removeElementEvent", id);
    });

    // メモイベントを送信する
    socket.on("sendgrMemoEvent", function(data) {
        Object.keys(master[data.user].socketID).forEach((id) => {
            io.to(id).emit("receivegrMemoEvent", {
                user: data.user,
                msg: data.msg,
                date: data.date,
            });
        });
    });
};
