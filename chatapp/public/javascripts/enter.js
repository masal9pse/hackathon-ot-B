'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#tluserName').val();
// 選択されたルーム名を取得する
const room = $('#tlroom').val();

// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', {
    'name': userName,
    'room': room,
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function(data) {
    if (data !== userName) { // 入室したのが自分のアカウントだった場合は表示しない
        $('#server-thread').prepend(
            '<div id="chat">' +
            `<p>${data}さんが入室しました</p>` +
            '</div>'
        );
    }
});

// 入室した時に前回退室した日時を表示する
socket.on('receiveWelcomeEvent', function(data) {
    $('#server-thread').prepend(
        '<div id="chat">' +
        `<p>ようこそ${data.name}さん！` +
        `${data.date}</p>` +
        '</div>'
    );
});

// 現在そのルームに入室しているユーザー名を表示する
socket.on('RoomEntryUserList', function(userList) {
    $('#room-member-list').empty();
    userList.forEach(member => {
        $('#room-member-list').prepend(
            `<li class="room-member h3 ml-3">${member}</li>`
        );
    });
});

// 現在入室している全ユーザー名を表示する
socket.on('AllEntryUserList', function(userList) {
    $('#member-list').empty();
    userList.forEach(member => {
        $('#member-list').prepend(
            "<li><a href='#' onclick='OnUsernameClick(this);' " +
            `id=${member}>${member}</a></li>`
        );
    });
});

