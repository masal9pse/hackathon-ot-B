"use strict";
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database/usersdb.sqlite'); //データベースを新規に開く

module.exports = function (socket, master) {
    socket.on("logInAuthRequest", function (data) {
        db.serialize(function () {

            // データベースにユーザ名が登録されているか確認
            let username_sql = db.prepare("select * from users where username=?");
            let user_db_check = username_sql.run(data.user);

            // パスワードが合っているか確認
            if (user_db_check === true) {
                let password_sql = db.prepare("select * from users where password=?");
                let password_db_check = password_sql.run(data.pass);
            }

            // ログイン日時を更新 => あとで

        });

        console.log(data.user + "：" + data.pass);
        socket.emit("logInApproval", true);
    });

    socket.on("signUpAuthRequest", function (data) {
        // ユーザ名が登録されていないか確認

        // ユーザ名，パスワード，ログイン日時をデータベースに挿入

        console.log(data.user + "：" + data.pass);
        socket.emit("signUpApproval", true);
    });
};
