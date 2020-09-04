'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#userName').val();
// 選択されたルーム名を取得する
const room = $('#room').val();
const password = $('#password').val();
const user = {
    'name': userName,
    'room': room,
    'pass': password,
};
// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', user);

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function (userName) {
    $('#thread').prepend(`<p>${userName}さんが入室しました</p>`);
});
