'use strict';

// チャットルームに入室する
function enter() {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();
    // あとでもう少し日本語っぽく修正予定
    const loginTime = $('#loginTime').val(new Date($.now()));

    // ユーザ名が未入力でないかチェックする
    if (userName === "") {
        // alert('ユーザー名を入力してください');
        alert($.now());
        return false;
    } else {
        $('form').submit();
    }
}
