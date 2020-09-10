"use strict";

const spl3 = Symbol();
const socket = Symbol();

const tl_reg = /^@tl/;
const gr_reg = /^@gr/; 

class History{

    constructor(healper){
        this.spl3 = require('sqlite3').verbose();
        this.healper = healper;
    }

    writeHistory(id, date, room, speaker, message, reply){
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        const stmt = db.prepare("insert into chat values (?, ?, ?, ?, ?, ?)");
        stmt.run(id, date, room, speaker, message, reply);
        stmt.finalize();
        db.close();
    }

    initializeThred(name, room, io, id, helper){
        let num_meg = 0;
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        db.serialize(function(){
            db.all(`select id, date, room, speaker, message, reply from chat where room = '${room}'`,
                function(err, rows){
                    if(rows==undefined){
                        console.log("none");
                    }else{
                        rows.forEach(function(row){
                            num_meg = String(row.id).replace(/[^0-9]/g, '');
                            //timelineかgroupchatかを識別
                            if(tl_reg.test(row.id)){
                                    if(name == row.speaker){      //発言者と一致しているかチェック、していたら<b>をつける
                                        io.to(id).emit("tlreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":row.id,
                                            "username": helper.add_a_tag(row.speaker, num_meg),
                                            "date": row.date,
                                            "msg": "<b>"+helper.format(row.message)+"</b>", 
                                            "rp_button" : helper.generate_reply(num_meg, "tl"),
                                            "rm_button": helper.generate_remove(num_meg)
                                        });
                                    }else{
                                        io.to(id).emit("tlreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":row.id,
                                            "username": helper.add_a_tag(row.speaker, num_meg),
                                            "date": row.date,
                                            "msg": helper.format(row.message), 
                                            "rp_button" : helper.generate_reply(num_meg, "tl"),
                                            "rm_button": ""
                                        });
                                    }
                            }else if(gr_reg.test(row.id)){
                                    if(name == row.speaker){      //発言者と一致しているかチェック、していたら<b>をつける
                                        io.to(id).emit("grreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":row.id,
                                            "username": helper.add_a_tag(row.speaker, num_meg),
                                            "date": row.date,
                                            "msg": "<b>"+helper.format(row.message)+"</b>", 
                                            "rp_button" : helper.generate_reply(num_meg, "gr"),
                                            "rm_button": helper.generate_remove(num_meg)
                                        });
                                    }else{
                                        io.to(id).emit("grreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":row.id,
                                            "username": helper.add_a_tag(row.speaker, num_meg),
                                            "date": row.date,
                                            "msg": helper.format(row.message), 
                                            "rp_button" : helper.generate_reply(num_meg, "gr"),
                                            "rm_button": ""
                                        });
                                    }

                            }else{
                                console.log("?");
                            }
                        });
                    }
                }
            );
        });
    }
}

module.exports = History;