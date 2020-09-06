'use strict';

// チャットルームに入室する
function enter(process) {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();

    // セレクトボックスと取得
    const room = $('#room').val();
    console.log(room);
    // return false;

    const password = $('#password').val();

    let now = new Date($.now()).toLocaleString();

    // ユーザ名が未入力でないかチェックする
    // if (userName === "" || event.which === 13 && event.shiftKey == false) {
    if (userName === "") {
        alert('ユーザー名を入力してください');
        return false;
    }
    
    const data = {
        'user': userName,
        'pass': password,
        'date': now,
    };
    // ログイン承認リクエストを送る
    socket.emit(`${process}AuthRequest`, data);

    socket.on(`${process}Approval`, function (response) {
        if (response.approval) {
            console.log(response.alert);
            document.logIn_form.submit();
        } else {
            alert(response.alert);
        }
    });
}

function signUp() {
    document.signUp_form.submit();
}
