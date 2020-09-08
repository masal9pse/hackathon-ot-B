'use strict';

// メモを画面上に表示する
function memo() {
    //空白文字の正規表現 先頭から末尾まで空白文字
    const regex = /^\s*$/;

    // ユーザ名を取得
    const userName = $("#tluserName").val();
    // 入力されたメッセージを取得
    const message = $('#tlmessage').val();
    //入力日時を取得
    let now = new Date($.now()).toLocaleString();

    //textareaを空にする
    $('#tlmessage').val(" ");

    if (regex.test(message)) { // メッセージが空かどうか
        alert("文章を入力してください");
    } else {
        // メモをサーバに送信する
        socket.emit('sendTlMemoEvent', {
            user: userName,
            msg:  message,
            date: now,
        });
    }
    
    return false;
}

// サーバから受信したメモを表示する
socket.on('receiveTlMemoEvent', function (data) {
    $('#tlthread').prepend(
        '<div id="chat">' +
            `<p id="chat_date"> ${data.date}  :  ${data.user} </p>` +
            `<p id="chat_message"> ${data.msg} </p>` +
        '</div>'
    );
});
