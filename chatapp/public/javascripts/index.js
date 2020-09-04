'use strict';

// チャットルームに入室する
function enter() {
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
    } else {
        document.logIn_form.submit();
    }
}

function signUp(){
    document.signUp_form.submit();
}

function first_enter() {
    const userName = $('#userName').val();
    const room = $('#room').val();
    const password = $('#userPassword').val();
    if (userName === "") {
        alert('ユーザー名を入力してください');
        return false;
    } else {
        document.logIn_form.submit();
    }
}