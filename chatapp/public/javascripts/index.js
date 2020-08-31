'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();
    // あとでもう少し日本語っぽく修正予定
    const loginTime = $('#loginTime').val(new Date($.now()));

    // セレクトボックスと取得
    const room = $('#room').val();
    console.log(room);
    // return false;

    // ユーザ名が未入力でないかチェックする
    // if (userName === "" || event.which === 13 && event.shiftKey == false) {
    if (userName === "") {
        alert('ユーザー名を入力してください');
        return false;
    } else {
        $('form').submit();
    }
}
