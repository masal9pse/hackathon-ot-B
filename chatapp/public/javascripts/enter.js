'use strict';

// 入室メッセージをサーバに送信する
// 入力されたユーザ名を取得する
const userName = $('#tluserName').val();
// 選択されたルーム名を取得する
const room = $('#tlroom').val();

// start();

// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', {
    'name': userName,
    'room': room,
});

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function(data) {
    if (data !== userName) { // 入室したのが自分のアカウントだった場合は表示しない
        $('#tlthread').prepend(`<p>${data}さんが入室しました</p>`);
    }
});

// 入室した時に前回退室した日時を表示する
socket.on('receiveWelcomeEvent', function(data) {
    $('#tlthread').prepend(
        '<div id="chat">' +
        `<p>ようこそ${data.name}さん！` +
        `あなたが最後にログインしていたのは${data.date}です。</p>` +
        '</div>');
});

socket.on('receiveRoomEvent', function(data) {
    console.log(data);
    let member = document.getElementById("room-member-list").children;
    if (nameChecker(member, data.name)) {
        $('#room-member-list').prepend(`<li class="room-member ml-3">${data.name}</li>`);
    }
});

// 現在入室している全ユーザー名を表示する
socket.on('receiveEntryUserList', function(userList) {
    $('#member-list').empty();
    userList.all_users.forEach(member => {
        $('#member-list').prepend(`<li><a href='#' onclick='OnUsernameClick(this);' id=${member}>${member}</a></li>`);
    });

    $('#room-member-list').empty();
    userList.room_users.forEach(member => {
        $('room-member-list').prepend(`<li class="room-member ml-3">${member}</li>`);
    });
});

