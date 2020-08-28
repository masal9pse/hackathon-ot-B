'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    // routes側で取得したデータを保存する？
    const userName = $('#userName').val();
    // ユーザ名が未入力でないかチェックする
    if (userName === "") {
        alert('ユーザー名を入力してください');
        return false;
    } else {
        $('form').submit();
    }
}
