'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#userName').val();
// 選択されたルーム名を取得する
const room = $('#room').val();
const user = {
    'name': userName,
    'room': room,
};
// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', user);

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function(data) {
    if (data !== userName) {
        $('#thread').prepend(`<p>${data}さんが入室しました</p>`);
    }
});

socket.on('receiveWelcomeEvent', function(data) {
    $('#thread').prepend(`<p>ようこそ${data.name}さん！あなたが最後にログインしていたのは${data.date}です。</p>`);
});

socket.on('receiveEntryUserList', function(userList) {
    // $('#member-list').prepend(`<li>${userName}</li>`);
    $('#member-list').empty();
    userList.forEach(member => {
        $('#member-list').prepend(`<li>${member}</li>`);
    });
});
