'use strict';

module.exports = function (socket, master) {
    socket.on('logInAuthRequest', function (data) {
        // データベースにユーザ名が登録されているか確認
        

        // パスワードが合っているか確認


        // ログイン日時を更新

        console.log(data.user + '：' + data.pass);
        socket.emit('logInApproval', true);
    });
};
