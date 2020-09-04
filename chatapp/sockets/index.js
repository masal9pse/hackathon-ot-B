'use strict';

const Manager = require('./manager');

module.exports = function (server) {

    const socketIo = require('socket.io')(server, {
        wsEngine: 'ws'
    });
    const io = socketIo.listen(server);

    const master = new Manager();

    io.sockets.on('connection', function (socket) {
        // ログインモジュールの呼び出し
        require('./log_in')(socket, master);

        // サインアップモジュールの呼び出し
        require('./sign_up')(socket, master);

        // 投稿モジュールの呼出
        require('./publish')(socket, io, master);

        // 入室モジュールの呼出
        require('./enter')(socket, master);

        // 退室モジュールの呼出
        require('./exit')(socket, master);
    });
};
