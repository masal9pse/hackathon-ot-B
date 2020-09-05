"use strict";
const sqlite3 = require('sqlite3').verbose();

module.exports = function (socket, master) {
    socket.on("logInAuthRequest", function (data) {
        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');

        db.serialize(function () {
            db.get(`select username, password from users where username='${data.user}'`,
                function (err, row) {
                    if (row) { // データベースにユーザ名が登録されているか
                        if (row.password === data.pass) { // パスワードが合っているか
                            socket.emit("logInApproval", {
                                approval: true,
                                alert: "ログインできます"
                            });
                        } else {
                            socket.emit("logInApproval", {
                                approval: false,
                                alert: "パスワードが間違っています"
                            });
                        }
                    } else {
                        socket.emit("logInApproval", {
                            approval: false,
                            alert: "そのユーザー名は存在しません"
                        });
                    }
                }
            );
        });
    });

    socket.on("signUpAuthRequest", function (data) {
        // データベースを新規に開く
        const db = new sqlite3.Database('./database/usersdb.sqlite');

        db.serialize(function () {
            db.get(`select  username, password from users where username='${data.user}'`,
                function (err, row) {
                    if (row === undefined) { // データベースにユーザ名が登録されていないか
                        const stmt = db.prepare("insert into users values (?, ?, ?)");
                        stmt.run(data.user, data.pass, socket.id);
                        // stmt.finalize();
                        socket.emit("signUpApproval", {
                            approval: true,
                            alert: "登録可能です"
                        });
                    } else {
                        socket.emit("signUpApproval", {
                            approval: false,
                            alert: "そのユーザー名はすでに登録されています"
                        });
                    }
                }
            );
        });
    });
};
