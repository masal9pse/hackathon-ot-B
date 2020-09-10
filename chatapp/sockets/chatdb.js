"use strict";

const spl3 = Symbol();

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

    // initializeThred(room){
    //     const db = new this.spl3.Database('./database/usersdb.sqlite');
    //     let his = [];
    //     db.serialize(function(){
    //         db.all("select id, date, speaker, message, reply from chat where room = '${room}';",
    //             function(err, rows){
    //                 if(row==undefined){
    //                     return false;
    //                 }else{
    //                     rows.forEach(function(row){
    //                         his.push();
    //                     });
    //                 }

    //             }
    //         );


    //     });
    // }
}

module.exports = History