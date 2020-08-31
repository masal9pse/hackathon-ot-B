'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#userName').val();
const room = $('#room').val();
// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', userName);
socket.emit('entryRoom', room);

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function (userName) {
    $('#thread').prepend('<p>' + userName + 'さんが入室しました。</p>');
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveRoom', function (room) {
    $('#thread').prepend('<p>' + room + '</p>');
});
