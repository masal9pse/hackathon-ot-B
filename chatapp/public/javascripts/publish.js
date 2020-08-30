'use strict';
// require("date-utils") なぜかできない


// 投稿メッセージをサーバに送信する
function publish() {
    const post = $("#post").val();

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
        return false;   
    }else{
        alert("連続して投稿することはできません");
    }
}

socket.on('Pause-minute', function(time){

    let count = time;

    var intervalID = setInterval(() => {    //1秒ごとにカウントダウン
        $("#post").val("Wait time : " + count--);
        console.log(count);
    }, 1000);

    setTimeout(() => {
        clearInterval(intervalID);　　　　　//time秒経過したらクリアして投稿ボタン復活
        $("#post").val("投稿");
    }, (time+1)*1000);
});

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('BroadcastEvent', function (data) {
    
    // data.msg.forEach(msg => {
    //     if(data.username != userName){
    //             $('#thread').prepend('<p>' + data.date + " : " + data.username + " : "+ msg +'</p>');
    //         }else{
    //             $('#thread').prepend('<p>' + data.date + " : " + data.username + " : "+ "<b>" + msg+ "</b>"+'</p>');
    //         }
    // });

    if(data.username != userName){
        $('#thread').prepend('<p>' + data.date + " : " + data.username + " : "+ data.msg +'</p>');
    }else{
        $('#thread').prepend('<p>' + data.date + " : " + data.username + " : "+ "<b>" + data.msg+ "</b>"+'</p>');
    }
});


