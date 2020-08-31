'use strict';
// require("date-utils") なぜかできない


// 投稿メッセージをサーバに送信する
function publish(code) {
    const post = $("#post").val();

    //if(code == 13){
    //}
    
    if(post=="投稿"){
        //空白文字の正規表現 先頭から末尾まで空白文字
        const regex = /^\s*$/;

        // ユーザ名を取得
        const userName = $("#userName").val();
        console.log(userName);

        // 入力されたメッセージを取得
        const message = $('#message').val();
        console.log("textarea input : "  + message);

        //入力日時を取得
        let now = new Date($.now());
        console.log(now);

        //textareaを空にする
        $('#message').val(" ");
        // 投稿内容を送信

        if(regex.test(message)){
            alert("文章を入力してください");
        }else{
            socket.json.emit("sendMessageEvent", {"date":now, "username": userName, "msg":message});
        }
    }else{
        alert("連続して投稿することはできません");
    }

    return false;
}


//待機イベント
socket.on('Pause', function(time){
    if(time==-1){
        $("#post").val("Wait other user");       //連続投稿を阻止 
    }else{
        $("#post").val("Wait time : " + time);   //カウントダウンを投稿ボタンに表示
    }
});


//復帰イベント
socket.on("Ready", function(){
    $("#post").val("投稿");   //投稿ボタンを復活
});

//表示イベント
socket.on('receiveMessageEvent', function (data) {
    $('#thread').prepend('<div id=message' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
     " : "+ data.msg +'</p>'+ data.rm_button + "</div>");
});


//削除イベント
socket.on("removeElementEvent", function (id){
    $("#" + id).remove();
});





function remove_message(element){
    const rm_msg = document.getElementById(element.id).parentNode;
    console.log(rm_msg.id);
    socket.emit("removeMessageEvent", rm_msg.id);
}

