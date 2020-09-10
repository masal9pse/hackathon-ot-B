"use strict";

const spl3 = Symbol();
const socket = Symbol();

const tl_reg = /^tl/;
const gr_reg = /^gr/; 

class History{

    constructor(helper){
        this.spl3 = require('sqlite3').verbose();
        this.helper = helper;
        this.helper.num_message = this.getMaxid();
        console.log(this.getMaxid() + 'BBBBBBBBBBBBBB');
        console.log(this.helper.num_message + 'AAAAA');
    }

    writeHistory(id, type, date, room, speaker, message, reply){
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        const stmt = db.prepare("insert into chat values (?, ?, ?, ?, ?, ?, ?)");
        stmt.run(id, type, date, room, speaker, message, reply);
        stmt.finalize();
        db.close();
    }

    getMaxid(){
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        var aaa = db.serialize(function () {
            db.get(`select max(id) from chat`,
                function (err, row) {
                    console.log(row);
                    return 10;
                    
                }
            );
        });
        return aaa;
    }

    initializeThred(name, room, io, id, helper){
        const db = new this.spl3.Database('./database/usersdb.sqlite');
        db.serialize(function(){
            db.all(`select id, type, date, room, speaker, message, reply from chat where room = '${room}'`,
                function(err, rows){
                    if(rows==undefined){
                        console.log("none");
                    }else{
                        rows.forEach(function(row){
                            //timelineかgroupchatかを識別
                            if(tl_reg.test(row.type)){
                                    if(name == row.speaker){      //発言者と一致しているかチェック、していたら<b>をつける
                                        io.to(id).emit("tlreceiveMessageEvent", {
                                            "num_message": Number(row.id),
                                            "messageid":"tlmessage" + Number(row.id),
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": "<b>"+helper.format(row.message)+"</b>", 
                                            "rp_button" : helper.generate_reply(Number(row.id), "tl"),
                                            "rm_button": helper.generate_remove(Number(row.id))
                                        });
                                    }else{
                                        io.to(id).emit("tlreceiveMessageEvent", {
                                            "num_message": Number(row.id),
                                            "messageid":"tlmessage" + Number(row.id),
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": helper.format(row.message), 
                                            "rp_button" : helper.generate_reply(Number(row.id), "tl"),
                                            "rm_button": ""
                                        });
                                    }
                            }else if(gr_reg.test(row.type)){
                                    if(name == row.speaker){      //発言者と一致しているかチェック、していたら<b>をつける
                                        io.to(id).emit("grreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":"grmessage" + Number(row.id),
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": "<b>"+helper.format(row.message)+"</b>", 
                                            "rp_button" : helper.generate_reply(Number(row.id), "gr"),
                                            "rm_button": helper.generate_remove(Number(row.id))
                                        });
                                    }else{
                                        io.to(id).emit("grreceiveMessageEvent", {
                                            "num_message": num_meg,
                                            "messageid":"grmessage" + Number(row.id),
                                            "username": helper.add_a_tag(row.speaker, Number(row.id)),
                                            "date": row.date,
                                            "msg": helper.format(row.message), 
                                            "rp_button" : helper.generate_reply(Number(row.id), "gr"),
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