'use strict';
const dm_reg = /^Who/;

function directMassagePublish() {
    DirectMessagePost();
}

$("#direct-message-form").keypress(function(e) {
    if (e.which === 13 && !e.shiftKey) {
        DirectMessagePost();
    }
});

//表示イベント
socket.on('dmreceiveMessageEvent', function(data) {
    console.log(data.username);
    const thread = document.getElementById("dmthread").children;
    if( (data.my_name == $("#tluserName").val()) || (data.my_name == String($("#dmname").text()).replace(dm, ""))){
        if (idChecker(thread, data.messageid)) { // 同じメッセージ番号のものを表示しない
            if (reverse) {
                $('#dmthread').append('<div id=' + data.messageid + ">" + "<p>" + data.date + " : " + data.username +
                    " : " + data.msg + '</p>' + data.rm_button + "</div>");
            } else {
                $('#dmthread').prepend('<div id=' + data.messageid + ">" + "<p>" + data.date + " : " + data.username +
                    " : " + data.msg + '</p>' + data.rm_button + "</div>");
            }
        }
        // メッセージ番号を更新
        latest_msg_num = data.num_message;
    }

})

function DirectMessagePost() {
    const {userName, message, room, now} = textarea("dm");

    // 投稿内容を送信
    if(dm_reg.test(String($("#dmname").text()))){
        alert("DMする相手を選んでください");
    }else if (regex.test(message)) {
        alert("文章を入力してください");
    } else {
        const to_name = String($("#dmname").text()).replace(dm, "");
        console.log(to_name);
        socket.json.emit("dmsendMessageEvent", {
            "date": now,
            "username": userName,
            "to_name": to_name,
            "room": room,
            "msg": message
        });     //投稿
    }
}
