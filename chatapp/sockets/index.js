'use strict';

const Manager = require('./manager');
const helper = require('./helper');
const History = require('./chatdb');

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
        // require('./publish')(socket, io, master, healper);

        const history = new History(helper);

        // 入室モジュールの呼出
        require('./enter')(socket, io, master, history, helper);

        // 退室モジュールの呼出
        require('./exit')(socket, io, master);

        //timelineモジュール
        require('./timeline')(socket, io, master, helper, history);

        //DMモジュール
        require('./directmessage')(socket, io, master, helper, history);

        //groupchatモジュール
        require('./groupchat')(socket, io, master, helper, history);

        //changeRoomモジュール
        require('./changeRoom')(socket, io, master, helper, history);

        //liveUserCheckモジュール
        require('./liveUserCheck')(socket, io, master);
    });
};
