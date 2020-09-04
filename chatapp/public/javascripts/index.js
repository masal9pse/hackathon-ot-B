'use strict';

// チャットルームに入室する
function enter(process) {
    // 入力されたユーザ名を取得する
    const userName = $('#userName').val();
    
    // セレクトボックスと取得
    const room = $('#room').val();
    console.log(room);
    // return false;

    const password = $('#userPassword').val();

    // ユーザ名が未入力でないかチェックする
    // if (userName === "" || event.which === 13 && event.shiftKey == false) {
    if (userName === "") {
        alert('ユーザー名を入力してください');
        return false;
    }
    const data = {
        'user': userName,
        'pass': password,
    };
    // ログイン承認リクエストを送る
    socket.emit(`${process}AuthRequest`, data);

    socket.on(`${process}Approval`, function (approval) {
        if (approval) {
            console.log("ログイン可");
            document.logIn_form.submit();
        } else {
            alert("ログイン不可");
        }
    });
}

function signUp(){
    document.signUp_form.submit();
}
