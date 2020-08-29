'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    // routes側で取得したデータを保存する？
    const userName = $('#userName').val();
    const loginTime = $('#loginTime').val($.now());

    // ユーザ名が未入力でないかチェックする
    if (userName === "") {
        // alert('ユーザー名を入力してください');
        alert($.now());
        return false;
    } else {
        $('form').submit();
    }
}
