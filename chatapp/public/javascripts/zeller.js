'use strict';


const today = new Date();
let disp_day = { "year": today.getFullYear(), "month": today.getMonth() + 1, "day": today.getDate() };
const week = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const maxday = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 29];
const reg_date = /^\d{4}-\d{2}-\d{2}$/;

let monday = 0;
let youbi = 0;

if (disp_day["month"] < 3) {
    youbi = ((disp_day["year"] - 1) + Math.floor((disp_day["year"] - 1) / 4) - Math.floor((disp_day["year"] - 1) / 100) + Math.floor((disp_day["year"] - 1) / 400) + Math.floor((13 * (disp_day["month"] + 12) + 8) / 5) + disp_day["day"]) % 7;
} else {
    youbi = (disp_day["year"] + Math.floor(disp_day["year"] / 4) - Math.floor(disp_day["year"] / 100) + Math.floor(disp_day["year"] / 400) + Math.floor((13 * disp_day["month"] + 8) / 5) + disp_day["day"]) % 7;
}

monday = disp_day["day"] - (youbi - 1);
disp_day["day"] = monday
// console.log(youbi);
// console.log(monday);


setDays(getWeekday(disp_day["year"], disp_day["month"], disp_day["day"]));



function getWeekday(year, month, firstday) {

    let days = [];
    let monthFinalday;

    if (month == 2 && checkuru(year)) {
        monthFinalday = maxday[13];
    } else {
        monthFinalday = maxday[month];
    }


    for (var j = 0; j < 7; j++) {
        if ((firstday + j) > monthFinalday) {
            if (month == 12) {
                days.push(String(year + 1) + "/" + String(1) + "/" + String(firstday + j - monthFinalday));
            } else {
                days.push(String(year) + "/" + String(month + 1) + "/" + String(firstday + j - monthFinalday));
            }
        } else {
            days.push(String(year) + "/" + String(month) + "/" + String(firstday + j));
        }
    }

    return days;
}

function setDays(ds) {
    resetSchedule();
    var d = document.getElementsByClassName("date");
    let splitted_ds;
    for (var i = 0; i < 7; i++) {
        if(!(reg_date.test(ds[i]))){
            splitted_ds = ds[i].split("/");
            ds[i] = splitted_ds[0] + "/" + "0" + splitted_ds[1] + "/" + splitted_ds[2]
        }
        d[i].innerHTML = ds[i];
    }
    socket.emit("setSchedule", {"username": $('#tluserName').val(), "start_date": ds[0].replace("/", "-").replace("/", "-"), "end_date": ds[6].replace("/", "-").replace("/", "-")})
}

function checkuru(y) {
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
        return true;
    }
    return false;
}

function resetSchedule(){
    $("#schedule0").empty();
    $("#schedule1").empty();
    $("#schedule2").empty();
    $("#schedule3").empty();
    $("#schedule4").empty();
    $("#schedule5").empty();
    $("#schedule6").empty();
}

function MoveWeek(button) {

    if (button.value == "⇐ Last week") {
        disp_day["day"] -= 7;
        if (disp_day["day"] <= 0) {
            if (checkuru(disp_day["year"]) && disp_day["month"] == 3) {
                disp_day["month"] = 2;
                disp_day["day"] = maxday[13] + disp_day["day"];
            } else if (disp_day["month"] == 1) {
                disp_day["month"] = 12;
                disp_day["year"]--;
                disp_day["day"] = maxday[disp_day["month"]] + disp_day["day"];
            } else {
                disp_day["month"]--;
                disp_day["day"] = maxday[disp_day["month"]] + disp_day["day"];
            }
        }
    } else {
        disp_day["day"] += 7;
        let maxd;

        if (checkuru(disp_day["year"]) && disp_day["month"] == 2) {
            maxd = maxday[13];
        } else {
            maxd = maxday[disp_day["month"]];
        }


        if (disp_day["day"] > maxd) {
            if (disp_day["month"] == 12) {
                disp_day["month"] = 1;
                disp_day["year"]++;
                disp_day["day"] = disp_day["day"] - maxd;
            } else {
                disp_day["month"]++;
                disp_day["day"] = disp_day["day"] - maxd;
            }
        }
    }

    setDays(getWeekday(disp_day["year"], disp_day["month"], disp_day["day"]));
}


function popSchedule() {
    // $('#sheet, #contain').show();
    $('#popSchedule, #contain').show();
}

function popClose() {
    $('#popSchedule, #contain').hide();
}

function registerSchedule() {

    let scheduleDate = String($("#scheduleDate").val());
    let schedule = String($('#userSchedule').val());

    if (reg_date.test(scheduleDate) && !regex.test(schedule)) {
        socket.json.emit("registerSchedule", {
            "date": scheduleDate,
            "schedule": schedule,
            "name": $('#tluserName').val()
        });

        $("#scheduleDate").val("");
        $('#userSchedule').val("");

        $('#popSchedule, #contain').hide();
    } else {
        alert("スケジュールを正しく入力してください");
    }
}

socket.on("addSchedule", function (data) {
    let d = document.getElementsByClassName("date");
    let scheduleContent;
    for (var i = 0; i < 7; i++) {
        if(data.date.replace(/-/g, "/") == d[i].textContent){  //表示中の日時と予定がマッチしていれば表示
            scheduleContent = d[i].nextElementSibling.id;
            $("#" + scheduleContent).append("<p class='scheduleContent'>" + data.schedule + "</p>");
            
        }
    }
});
