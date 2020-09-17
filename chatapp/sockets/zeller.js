'use strict';

const sockets = require('.');
const spl3 = require('sqlite3').verbose();

module.exports = function (socket, io, master, helper, history) {
    socket.on("registerSchedule", function (data) {
        console.log("register:" + data.date);
        console.log("register:" + data.schedule);
        console.log("register:" + data.name);

        //DBへの登録処理
        const db = new spl3.Database('./database/usersdb.sqlite');
        const stmt = db.prepare("insert into schedule values (?, ?, ?)");
        stmt.run(data.name, data.schedule, data.date);
        stmt.finalize();
        db.close();

        socket.emit("addSchedule", {
            "date": data.date,
            "schedule": data.schedule,
            "name": data.name
        })
    });

    socket.on("setSchedule", function (data) {
        console.log(data.username);
        console.log(data.start_date);
        console.log(data.end_date);

        const db = new spl3.Database('./database/usersdb.sqlite');
        db.serialize(function () {
            db.all(`select username, plan, date from schedule where date >= '${data.start_date}' AND date <= '${data.end_date}' AND username = '${data.username}'`,
                function (err, rows) {
                    if (rows == undefined) {
                        console.log("none");
                    } else {
                        rows.forEach(function (row) {
                            socket.emit("addSchedule", {
                                "date": row.date,
                                "schedule": row.plan,
                                "name": row.username
                            })
                        });
                    }
                });
        });
    });
}
