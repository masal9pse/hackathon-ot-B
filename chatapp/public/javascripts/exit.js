'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名取得
    const userName = $('#userName').val();
    const room = $('#room').val();
    let now = new Date($.now()).toLocaleString();
    
    // 退室メッセージイベントを送信する
    socket.emit('exitMyselfEvent', {
        'name': userName,
        'room': room,
        'date': now,
    });

    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('receiveExitEvent', function (data) {
    if (data !== userName) {
        $('#thread').prepend(`<p>${data}さんが退室しました</p>`);
    }
});
