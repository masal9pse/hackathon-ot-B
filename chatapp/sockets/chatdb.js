"use strict";

const sockets = require('.');

const spl3 = Symbol();
const socket = Symbol();

const tl_reg = /^tl/;
const gr_reg = /^gr/;
const dm_reg = /^dm/;
const rp_reg = /^reply/;


class History {
    constructor(helper) {
        this.spl3 = require('sqlite3').verbose();
        this.helper = helper;
    }

    removeReady(socket, io) {
        const db = new this.spl3.Database('./database/usersdb.sqlite');

        socket.on("removeMessageEvent", function (id) {
            const delete_id = String(id).match(/\d/);
            if (delete_id) {
                console.log(String(id));
                console.log(delete_id[0]);
                db.run(`DELETE FROM chat WHERE id=?`, delete_id[0], function (err) {
                    if (err) {
                        return false;
                    }
                    console.log("remove" + id);
                    io.sockets.emit("removeElementEvent", id);
                });
            }else{
                console.log("remove" + id);
                io.sockets.emit("removeElementEvent", id);
            }
        });
    }

    writeHistory(id, type, date, room, speaker, message, reply) {
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        const stmt = db.prepare("insert into chat values (?, ?, ?, ?, ?, ?, ?)");
        stmt.run(id, type, date, room, speaker, message, reply);
        stmt.finalize();
        db.close();
    }

    getMaxid() {
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        db.serialize(function () {
            db.get(`select max(id) from chat`,
                function (err, row) {
                    console.log(row["max(id)"]);
                    setID(row["max(id)"]);

                }
            );
        });
    }

    setID(num) {
        this.helper.num_message = num;
    }

    initializeThred(name, room, io, id, helper) {
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        db.serialize(function () {
            db.all(`select id, type, date, room, speaker, message, res from chat where room = '${room}'`,
                function (err, rows) {
                    if (rows == undefined) {
                        console.log("none");
                    } else {
                        rows.forEach(function (row) {
                            //timelineかgroupchatかを識別
                            if (tl_reg.test(row.type)) {
                                if (name == row.speaker) {      //発言者と一致しているかチェック、していたら<b>をつける
                                    io.to(id).emit("tlreceiveMessageEvent", {
                                        "num_message": Number(row.id),
                                        "messageid": "tlmessage" + Number(row.id),
                                        "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                        "date": row.date,
                                        "msg": "<b>" + helper.format(row.message) + "</b>",
                                        "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                        "rm_button": helper.generate_remove(Number(row.id))
                                    });
                                } else {
                                    io.to(id).emit("tlreceiveMessageEvent", {
                                        "num_message": Number(row.id),
                                        "messageid": "tlmessage" + Number(row.id),
                                        "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                        "date": row.date,
                                        "msg": helper.format(row.message),
                                        "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                        "rm_button": ""
                                    });
                                }
                            } else if (gr_reg.test(row.type)) {
                                if (name == row.speaker) {      //発言者と一致しているかチェック、していたら<b>をつける
                                    io.to(id).emit("grreceiveMessageEvent", {
                                        "num_message": Number(row.id),
                                        "messageid": "grmessage" + Number(row.id),
                                        "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                        "date": row.date,
                                        "msg": "<b>" + helper.format(row.message) + "</b>",
                                        "rp_button": helper.generate_reply(Number(row.id), "gr"),
                                        "rm_button": helper.generate_remove(Number(row.id))
                                    });
                                } else {
                                    io.to(id).emit("grreceiveMessageEvent", {
                                        "num_message": Number(row.id),
                                        "messageid": "grmessage" + Number(row.id),
                                        "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                        "date": row.date,
                                        "msg": helper.format(row.message),
                                        "rp_button": helper.generate_reply(Number(row.id), "gr"),
                                        "rm_button": ""
                                    });
                                }

                            } else if (rp_reg.test(row.type)) {
                                console.log("rp");
                                if (tl_reg.test(row.res)) {
                                    if (name == row.speaker) {      //発言者と一致しているかチェック、していたら<b>をつける
                                        io.to(id).emit("tlreceiveReplyMessage", {
                                            "num_message": Number(row.id),
                                            "messageid": "reply" + Number(row.id),
                                            "reply": row.res,
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": "<b>" + helper.format(row.message) + "</b>",
                                            "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                            "rm_button": helper.generate_remove(Number(row.id))
                                        });
                                    } else {
                                        io.to(id).emit("tlreceiveReplyMessage", {
                                            "num_message": Number(row.id),
                                            "messageid": "tlmessage" + Number(row.id),
                                            "reply": row.res,
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": helper.format(row.message),
                                            "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                            "rm_button": ""
                                        });
                                    }
                                } else if (gr_reg.test(row.res)) {
                                    if (tl_reg.test(row.res)) {
                                        if (name == row.speaker) {      //発言者と一致しているかチェック、していたら<b>をつける
                                            io.to(id).emit("grreceiveReplyMessage", {
                                                "num_message": Number(row.id),
                                                "messageid": "reply" + Number(row.id),
                                                "reply": row.res,
                                                "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                                "date": row.date,
                                                "msg": "<b>" + helper.format(row.message) + "</b>",
                                                "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                                "rm_button": helper.generate_remove(Number(row.id))
                                            });
                                        } else {
                                            io.to(id).emit("grreceiveReplyMessage", {
                                                "num_message": Number(row.id),
                                                "messageid": "tlmessage" + Number(row.id),
                                                "reply": row.res,
                                                "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                                "date": row.date,
                                                "msg": helper.format(row.message),
                                                "rp_button": helper.generate_reply(Number(row.id), "tl"),
                                                "rm_button": ""
                                            });
                                        }
                                    }
                                }
                            } else {
                                console.log("?");
                            }
                        });
                    }
                }
            );
        });
    }

    initializeDirectMessage(my_name, to_name, to_id, my_id, io, helper) {
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        db.serialize(function () {
            db.all(`select id, type, date, room, speaker, message, res from chat where res = '${to_name}' or res = '${my_name}'`,
                function (err, rows) {
                    rows.forEach(function (row) {
                        io.to(my_id).emit("dmreceiveMessageEvent", {
                            "num_message": Number(row.id),
                            "messageid": "dmmessage" + Number(row.id),
                            "username": helper.add_a_tag(row.speaker, Number(row.id),),
                            "to_name": to_name,
                            "my_name": my_name,
                            "date": row.date,
                            "msg": "<b>" + helper.format(row.message) + "</b>",
                            "rm_button": helper.generate_remove(Number(row.id))
                        });

                        // DMの相手に送信
                        io.to(to_id).emit("dmreceiveMessageEvent", {
                            "num_message": Number(row.id),
                            "messageid": "dmmessage" + Number(row.id),
                            "username": helper.add_a_tag(row.speaker, Number(row.id),),
                            "to_name": to_name,
                            "my_name": my_name,
                            "date": row.date,
                            "msg": helper.format(row.message),
                            "rm_button": helper.generate_remove(Number(row.id))
                        });
                    });
                }
            );
        });
    }
}

module.exports = History;
