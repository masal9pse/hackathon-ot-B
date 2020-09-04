'use strict';

module.exports = function (socket, master) {
    socket.on('logInAuthRequest', function (data) {
        // データベースにユーザ名が登録されているか確認
        

        // パスワードが合っているか確認


        // ログイン日時を更新
        

        console.log(data.user + '：' + data.pass);
        socket.emit('logInApproval', true);
    });

    socket.on('signUpAuthRequest', function (data) {
        // ユーザ名が登録されていないか確認


        // ユーザ名，パスワード，ログイン日時をデータベースに挿入
        

        console.log(data.user + '：' + data.pass);
        socket.emit('signUpApproval', true)
    });
};
