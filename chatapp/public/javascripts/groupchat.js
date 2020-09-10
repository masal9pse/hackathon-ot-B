'use strict';

function groupchatPublish() {
    GroupChatPost();
}

$("#group-chat-form").keypress(function(e) {
    if (e.which === 13 && !e.shiftKey) {
        GroupChatPost();
    }
});

//表示イベント
socket.on('grreceiveMessageEvent', function(data) {
    console.log(data.username);
    const thread = document.getElementById("grthread").children;
    if (idChecker(thread, data.messageid)) { // 同じメッセージ番号のものを表示しない
        if (reverse) {
            $('#grthread').append('<div id=' + data.messageid + ">" + "<p>" + data.date + " : " + data.username +
                " : " + data.msg + '</p>' + data.rp_button + data.rm_button + "</div>");
        } else {
            $('#grthread').prepend('<div id=' + data.messageid + ">" + "<p>" + data.date + " : " + data.username +
                " : " + data.msg + '</p>' + data.rp_button + data.rm_button + "</div>");
        }
    }
})

//replyイベント
socket.on("grreceiveReplyMessage", function(data) {
    const reply = String(data.reply);
    const thread = document.getElementById(reply).children;
    if (idChecker(thread, data.messageid)) { // 同じメッセージ番号のものを表示しない
        $("#" + reply).append('<div id=' + data.messageid + ">" + "<p>" + data.date + " : " + data.username +
            " : " + data.msg + '</p>' + data.rp_button + data.rm_button + "</div>");
    }
});

function GroupChatPost() {
    const {userName, message, room, now} = textarea("gr");

    // 投稿内容を送信
    if (regex.test(message)) {
        alert("文章を入力してください");
    } else if (reply.test(message)) {
        console.log("to " + message.match(reply));
        socket.json.emit("grreplyMessageEvent", {
            "date": now,
            "reply": message.match(reply),
            "username": userName,
            "room": room, "msg": message
        });    //reply
    } else {
        socket.json.emit("grsendMessageEvent", {
            "date": now,
            "username": userName,
            "room": room,
            "msg": message
        });     //投稿
    }
}
