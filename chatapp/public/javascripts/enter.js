'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#userName').val();
// 選択されたルーム名を取得する
const room = $('#room').val();

// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', {
    'name': userName,
    'room': room,
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function (data) {
    if (data !== userName) { // 入室したのが自分のアカウントだった場合は表示しない
        $('#thread').prepend(`<p>${data}さんが入室しました</p>`);
    }
});

// 入室した時に前回退室した日時を表示する
socket.on('receiveWelcomeEvent', function (data) {
    $('#thread').prepend(
        `<p>ようこそ${data.name}さん！` +
        `あなたが最後にログインしていたのは${data.date}です。</p>`);
});

// 現在入室している全ユーザー名を表示する
socket.on('receiveEntryUserList', function (userList) {
    $('#member-list').empty();
    userList.forEach(member => {
        $('#member-list').prepend(`<li>${member}</li>`);
    });
});
