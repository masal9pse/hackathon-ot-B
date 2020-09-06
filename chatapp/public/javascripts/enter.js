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
console.log(user.name);
// console.log(userName);
// console.log(user.room);
// console.log(name);
// 入室メッセージイベントを送信する
socket.emit('entryMyselfEvent', user);

// Get room and users
// socket.on('roomUsers', ({
//     room,
//     users
//   }) => {
//     outputRoomName(room);
//     outputUsers(users);
//   });

// サーバから受信した入室メッセージを画面上に表示する
socket.on('receiveEntryEvent', function (userName) {
    // $('#thread').prepend(`<p>${userName}さんが入室しました</p>`);
    $('#thread').prepend(`<p>${user.name}さんが入室しました</p>`);

    // user.name;
    console.log(user.name);
});
socket.on('receiveEntryEvent2', function (userName) {
    $('#member-list').prepend(`<li>${userName}</li>`);
});
