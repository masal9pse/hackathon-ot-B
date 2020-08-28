'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#userName').val();
// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', userName);

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function (data) {
    $('#thread').prepend('<p>' + data + 'さんが入室しました。</p>');
});
