'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = $("#userName").val();
    // 入力されたメッセージを取得
    const message = $('#message').val();
    //入力日時を取得
    let now = new Date($.now());
    //textareaを空にする
    $('#message').val(" ");

    // メモの内容を表示
    // $('#thread').text(message);
    $('#thread').prepend(`<div id="chat"> <p id="chat_date"> ${now.toLocaleString()}  :  ${userName} </p> <p id="chat_message"> ${message} </p> </div>`);

    return false;
}
