'use strict';

function timelinePublish(){
    const post = $("#tlpost").val();

    if (post=="投稿") {

        const {userName, message, room, now} = textarea("tl");

        // 投稿内容を送信
        if (regex.test(message)) {
            alert("文章を入力してください");
        } else if (reply.test(message)) {
            console.log("to RP" + message.match(reply));
            socket.json.emit("tlreplyMessageEvent", {
                "date":now,
                "reply": message.match(reply),
                "username": userName,
                "room":room,"msg":message
            });    //reply
        } else {
            socket.json.emit("tlsendMessageEvent", {
                "date":now,
                "username": userName,
                "room": room,
                "msg":message
            });     //投稿
        }
    } else {
        alert("連続して投稿することはできません");
    }

    return false;
}

//表示イベント
socket.on('tlreceiveMessageEvent', function (data) {
    // console.log(data.username);
    const thread = document.getElementById("tlthread").children;
    if (idChecker(thread, data.messageid)){ // 同じメッセージ番号のものを表示しない
        if(reverse){
            $('#tlthread').append('<div id=' + data.messageid + ">" + "<p>"+ data.date + " : " + data.username +
            " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
        }else{
            $('#tlthread').prepend('<div id=' + data.messageid + ">" + "<p>"+ data.date + " : " + data.username +
            " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
        }
    }

});

//待機イベント
socket.on('Pause', function (time) {
    if (time === -1) {
        $("#tlpost").val("Wait other user");       //連続投稿を阻止 
    } else {
        $("#tlpost").val("Wait time : " + time);   //カウントダウンを投稿ボタンに表示
    }
});


//復帰イベント
socket.on("Ready", function () {
    $("#tlpost").val("投稿");   //投稿ボタンを復活
});

//replyイベント
socket.on("tlreceiveReplyMessage", function (data) {
    const reply = String(data.reply);
    const thread = document.getElementById(reply).children;
    if (idChecker(thread, data.messageid)) { // 同じメッセージ番号のものを表示しない
        $("#"+reply).append('<div id=' + data.messageid + ">" + "<p>"+ data.date + " : " + data.username +
        " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
    }

    // メッセージ番号を更新
    latest_msg_num = data.num_message;
});