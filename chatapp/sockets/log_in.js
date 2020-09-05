"use strict";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/usersdb.sqlite'); //データベースを新規に開く

module.exports = function (socket, master) {
    socket.on("logInAuthRequest", function (data) {
        db.serialize(function () {
            db.get(`select username, password from users where username='${data.user}'`,
                function (err, row) {
                    if (row) { // データベースにユーザ名が登録されているか
                        if (row.password === data.pass) { // パスワードが合っているか
                            socket.emit("logInApproval", true);
                        } else {
                            socket.emit("logInApproval", false);
                        }
                    } else {
                        socket.emit("logInApproval", false);
                    }
                }
            );
        });
    });

    socket.on("signUpAuthRequest", function (data) {
        // ユーザ名が登録されていないか確認

        // ユーザ名，パスワード，ログイン日時をデータベースに挿入

        console.log(data.user + "：" + data.pass);
        socket.emit("signUpApproval", true);
    });
};
