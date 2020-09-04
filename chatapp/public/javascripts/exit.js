'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    const userName = $('#userName').val();
    const room = $('#room').val();
    const user = {
        'name': userName,
        'room': room,
    };
    // 退室メッセージイベントを送信する
    socket.emit('exitMyselfEvent', user);

    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('receiveExitEvent', function (data) {
    $('#thread').prepend(`<p>${data}さんが退室しました</p>`);
});
