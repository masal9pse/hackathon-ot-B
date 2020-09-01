'use strict';

const Manager = require('./manager');

module.exports = function (server) {

    const socketIo = require('socket.io')(server, {
        wsEngine: 'ws'
    });
    const io = socketIo.listen(server);

    const manager = require("./manager");        //namager.jsの読み込み
    const master = new Manager();

    io.sockets.on('connection', function (socket) {
        // 投稿モジュールの呼出
        require('./publish')(socket, io, master);

        // 入室モジュールの呼出
        require('./enter')(socket, master);

        // 退室モジュールの呼出
        require('./exit')(socket, master);
    });
};
