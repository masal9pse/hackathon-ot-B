'use strict';

// メモを画面上に表示する
function memo() {
    // ユーザ名を取得
    const userName = '';
    // 入力されたメッセージを取得
    const message = $('#message').val();
    // メモの内容を表示
    // $('#thread').text(message);
    $('#thread').prepend('<p>' + message + '</p>');

    return false;
}
