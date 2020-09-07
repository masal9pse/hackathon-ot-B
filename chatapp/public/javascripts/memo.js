'use strict';

// メモを画面上に表示する
function memo(){
    //空白文字の正規表現 先頭から末尾まで空白文字
    const regex = /^\s*$/;

    // ユーザ名を取得
    const userName = $("#userName").val();

    // 入力されたメッセージを取得
    const message = $('#message').val();

    //入力日時を取得
    let now = new Date($.now()).toLocaleString();
    console.log(now);

    //textareaを空にする
    $('#message').val(" ");
    
    // メモの内容を表示
    // $('#thread').text(message);

    if (regex.test(message)) {
        alert("文章を入力してください");
    } else {
        socket.emit('sendMemoEvent', {
            user: userName,
            msg:  message,
            date: now,
        });
    }
    
    return false;
}

socket.on('receiveMemoEvent', function(data) {
    $('#thread').prepend(
        '<div id="chat">' +
            '<p id="chat_date">' +
                `${data.date}  :  ${data.user}` +
            '</p>' +
            '<p id="chat_message">' +
                `${data.msg}` +
            '</p>' +
        '</div>'
    );
});
