'use strict';

module.exports = function(socket, io, master, helper, history) {
    // 退室メッセージをクライアントに送信する
    socket.on('changeRoomEvent', function(data) {
        console.log(`changeRoomしたユーザ名：${data.user_name}`);

        // 遷移前のroomから退室する
        socket.leave(data.pre_room);

        // 他クライアントが受信する退室表示イベントを送信する
        socket.to(data.pre_room).emit('receiveExitEvent', data.user_name);

        // 遷移先のroomに入室する
        socket.join(data.next_room);

        // Managerで管理しているユーザのSocketIdに対応するルーム名を更新
        master[data.user_name].socketID[socket.id] = data.next_room;

        // 他クライアントが受信する入室表示イベントを送信する
        socket.to(data.next_room).emit('receiveEntryEvent', data.user_name);

        // 遷移先ルームのスレッドを取得し送信
        history.initializeThred(data.user_name, data.next_room, io, socket.id, helper);

        console.log(master);
    });
}
