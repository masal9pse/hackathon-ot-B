'use strict';

// 退室メッセージをサーバに送信する
function exit() {
    // ユーザ名を取得
    const userName = $('#tluserName').val();
    // ルーム名を取得
    const room = $('#tlroom').val();

    // 現在の日時を取得
    let now = new Date($.now()).toLocaleString();
    
    // 退室メッセージイベントを送信する
    socket.emit('exitMyselfEvent', {
        'name': userName,
        'room': room,
        'date': now,
    });

    socket.disconnect();

    // 退室
    location.href = '/';
}

// サーバから受信した退室メッセージを画面上に表示する
socket.on('receiveExitEvent', function (data) {
    if (data !== userName) { // 退室したのが自分のアカウントだった場合は表示しない
        $('#server-thread').prepend(
            '<div id="chat">' +
            `<p>${data}さんが退室しました</p>` +
            '</div>'
        );
    }
});
