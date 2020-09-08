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
        require('./log_in')(socket);

        // 投稿モジュールの呼出
        require('./publish')(socket, io, master);

        // 入室モジュールの呼出
        require('./enter')(socket, io, master);

        // 退室モジュールの呼出
        require('./exit')(socket, io, master);

        //timelineモジュール
        require('./timeline')(socket, io, master);

        //groupchatモジュール
        require('./groupchat')(socket, io, master);
    });
};
