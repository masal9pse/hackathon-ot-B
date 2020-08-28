'use strict';

// 投稿メッセージをサーバに送信する
function publish() {
    //空白文字の正規表現 先頭から末尾まで空白文字
    const regex = /^\s*$/;
    // ユーザ名を取得
    const userName = '';
    // 入力されたメッセージを取得
    const message = $('#message').val();
    console.log("textarea input : "  + message);
    //textareaを空にする
    $('#message').val(" ");
    // 投稿内容を送信

    // socket.emit("sendMessageEvent", message);

    if(regex.test(message)){
        alert("文章を入力してください");
    }else{
        socket.emit("sendMessageEvent", message);
    }

    return false;
}

// サーバから受信した投稿メッセージを画面上に表示する
socket.on('BroadcastEvent', function (data) {
    $('#thread').prepend('<p>' + data +'</p>');
});
