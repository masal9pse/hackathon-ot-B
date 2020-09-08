'use strict';

// チャットルームに入室する
function enter(process) {
    //空白文字の正規表現 先頭から末尾まで空白文字
    const regex = /^\s*$/;

    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();
    // ルーム名を取得
    const room = $('#room').val();
    // 入力されたパスワードを取得
    const password = $('#password').val();
    // 現在の日時を取得
    let now = new Date($.now()).toLocaleString();

    // ユーザ名が未入力でないかチェックする
    if (regex.test(userName)) {
        alert('ユーザー名を入力してください');
        return false;
    }

    // パスワードが未入力でないかチェックする
    if (regex.test(password)) {
        alert('パスワードを入力してください');
        return false;
    }

    // ログイン承認リクエストを送る
    socket.emit(`${process}AuthRequest`, {
        'user': userName,
        'pass': password,
        'date': now,
    });

    // サーバーからのログイン承認イベントを受け取る
    socket.on(`${process}Approval`, function(response) {
        if (response.approval) {
            console.log(response.alert);
            document.logIn_form.submit();
        } else {
            alert(response.alert);
            stop();
        }
    });
}

// サインアップページに入室する
function signUp() {
    document.signUp_form.submit();
}
