'use strict'

// 部屋替えメッセージをサーバに送る
function changeRoom(next_room) { // 遷移先のルーム名を引数に取る
    // ユーザ名を取得
    const userName = $('#tluserName').val();
    // 遷移前のルーム名を取得
    const pre_room = $('#tlroom').val();

    // 遷移前と先のルームが同じなら遷移しない
    if (next_room === pre_room) {
        return false;
    }

    // スレッドを空にする
    $('#tlthread').empty();
    $('#grthread').empty();
    $('#server-thread').empty();

    // ルーム名の表示を更新する
    $('#group-name').text(next_room);
    $('#tlroom').val(next_room);
    $('#grroom').val(next_room);
    $('#dmroom').val(next_room);

    // ルーム遷移メッセージイベントを送信する
    socket.emit('changeRoomEvent', {
        'user_name': userName,
        'pre_room':  pre_room,
        'next_room': next_room,
    });
}
