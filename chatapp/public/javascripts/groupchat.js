'use strict';

function groupchatPublish(){
    const {userName, message, room, now} = textarea("gr");

    // 投稿内容を送信
    if (regex.test(message)) {
        alert("文章を入力してください");
    } else if (reply.test(message)) {
        console.log("to " + message.match(reply));
        socket.json.emit("grreplyMessageEvent", {
            "date":now,
            "reply": message.match(reply),
            "username": userName,
            "room":room,"msg":message
        });    //reply
    } else if (dm.test(message)) {   //DMを押したらDMのトークルームに遷移を後々する
        console.log("to " + message.match(dm));
        socket.json.emit("directMessageEvent", {
            "date":now,
            "to": message.match(dm),
            "username": userName,
            "room":room,
            "msg":message
        });    //DM
    } else {
        socket.json.emit("grsendMessageEvent", {
            "date":now,
            "username": userName,
            "room": room,
            "msg":message
        });     //投稿
    }
}

//表示イベント
socket.on('grreceiveMessageEvent', function (data) {
    console.log(data.username);

    if (data.num_message !== latest_msg_num) { // 同じメッセージ番号のものを表示しない
        if(reverse){
            $('#grthread').append('<div id=grmessage' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
            " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
        }else{
            $('#grthread').prepend('<div id=grmessage' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
            " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
        }
    }

    // メッセージ番号を更新
    latest_msg_num = data.num_message;

})

//replyイベント
socket.on("grreceiveReplyMessage", function (data) {
    if (data.num_message !== latest_msg_num) { // 同じメッセージ番号のものを表示しない
        const reply = String(data.reply);
        $("#"+reply).append('<div id=reply' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
        " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
    }

    // メッセージ番号を更新
    latest_msg_num = data.num_message;
});