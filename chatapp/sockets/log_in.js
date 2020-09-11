"use strict";
const sqlite3 = require('sqlite3').verbose();

module.exports = function (socket) {
    socket.on("logInAuthRequest", function (data) {
        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');

        db.serialize(function () {
            // データベースからユーザー名と対応するパスワードを取得
            db.get(`select password from users where username='${data.user}'`,
                function (err, row) {
                    if (row !== undefined) { // データベースにユーザ名が登録されているか
                        if (row.password === data.pass) { // パスワードが合っているか
                            socket.emit("logInApproval", {
                                approval: true,
                                alert: "ログインできます"
                            });

                            db.close();
                        } else {
                            socket.emit("logInApproval", {
                                approval: false,
                                alert: "パスワードが間違っています",
                            });

                            db.close();
                        }
                    } else {
                        socket.emit("logInApproval", {
                            approval: false,
                            alert: "そのユーザー名は存在しません"
                        });

                        db.close();
                    }
                }
            );
        });
    });

    socket.on("signUpAuthRequest", function (data) {
        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');

        db.serialize(function () {
            // データベースからユーザ名と対応するパスワードを取得
            db.get(`select password from users where username='${data.user}'`,
                function (err, row) {
                    if (row === undefined) { // データベースにユーザ名が登録されていないか
                        // データベースにユーザー名，パスワード，サインアップ日時を登録
                        const stmt = db.prepare("insert into users values (?, ?, ?)");
                        stmt.run(data.user, data.pass, "new_user");
                        stmt.finalize();

                        socket.emit("signUpApproval", {
                            approval: true,
                            alert: "登録可能です"
                        });

                        db.close();
                    } else {
                        socket.emit("signUpApproval", {
                            approval: false,
                            alert: "そのユーザー名はすでに登録されています"
                        });

                        db.close();
                    }
                }
            );
        });
    });
};
