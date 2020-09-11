'use strict';

module.exports = function(socket, io, master) {
    // disconnect が発火したときに Manager をチェックする
    socket.on('disconnect', function() {
        console.log("##### disconnect #####");
        // Manager を参照して，SocketID が生きているか確認する
        // 死んでいれば削除する
        io.of('/').clients(function(err, living_clients) {
            Object.keys(master).forEach(function(element) {
                Object.keys(master[element].socketID).forEach(function(user_id) {
                    if (!living_clients.includes(user_id)) {
                        delete master[element].socketID[user_id];
                        if (Object.keys(master[element].socketID).length === 0) {
                            delete master[element];
                        }
                    }
                });
            });
        });
    });
}
