'use strict';

const Manager = require('./manager');
const healper = require('./helper');
const History = require('./chatdb');

module.exports = function (server) {

    const socketIo = require('socket.io')(server, {
        wsEngine: 'ws'
    });
    const io = socketIo.listen(server);

    const master = new Manager();
    const history = new History(healper);

    io.sockets.on('connection', function (socket) {
        // ログインモジュールの呼び出し
        require('./log_in')(socket);

        // 投稿モジュールの呼出
        // require('./publish')(socket, io, master, healper);

        // 入室モジュールの呼出
        require('./enter')(socket, io, master);

        // 退室モジュールの呼出
        require('./exit')(socket, io, master);

        //timelineモジュール
        require('./timeline')(socket, io, master, healper, history);

        //groupchatモジュール
        require('./groupchat')(socket, io, master, healper, history);

    });
};
