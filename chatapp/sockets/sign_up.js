'use strict';

module.exports = function (socket, master) {
    socket.on('signUpAuthRequest', function (data) {
        // ユーザ名が登録されていないか確認

        // ユーザ名，パスワード，ログイン日時をデータベースに挿入

        console.log(data.user + '：' + data.pass);
        socket.emit('signUpApproval', true)
    });
};
