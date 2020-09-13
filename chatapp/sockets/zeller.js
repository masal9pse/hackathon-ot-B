'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 0;

module.exports = function (socket, io, master, helper, history) {
    socket.on("registerSchedule", function(data){
        console.log(data.date);
        console.log(data.schedule);
        console.log(data.name);


        //ここにDBへの登録処理を入れたい

        socket.emit("addSchedule", {
            "date": data.date,
            "schedule": data.schedule,
            "name" : data.name
        })
    });
}