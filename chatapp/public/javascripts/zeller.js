'use strict';

const today = new Date();
let disp_day = {"year":today.getFullYear(), "month": today.getMonth() + 1, "day": today.getDate()};
const week = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const maxday = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31, 29];

function start() {
    // console.log(disp_day["year"]);
    // console.log(disp_day["month"]);
    // console.log(disp_day["day"]);
    var monday = 0;
    var youbi = 0;

    if (disp_day["month"] < 3) {
        youbi = ((disp_day["year"] - 1) + Math.floor((disp_day["year"] - 1) / 4) - Math.floor((disp_day["year"] - 1) / 100) + Math.floor((disp_day["year"] - 1) / 400) + Math.floor((13 * (disp_day["month"] + 12) + 8) / 5) + disp_day["day"]) % 7;
    } else {
        youbi = (disp_day["year"] + Math.floor(disp_day["year"] / 4) - Math.floor(disp_day["year"] / 100) + Math.floor(disp_day["year"] / 400) + Math.floor((13 * disp_day["month"] + 8) / 5) + disp_day["day"]) % 7;
    }

    monday = disp_day["day"]-(youbi-1);
    disp_day["day"] = monday
    // console.log(youbi);
    // console.log(monday);


    setDays(getWeekday(disp_day["year"], disp_day["month"], disp_day["day"]));

}

function getWeekday(year, month, firstday){

    let days = [];
    let monthFinalday;

    if(month==2 && checkuru(year)){
        monthFinalday = maxday[13];
    }else{
        monthFinalday = maxday[month];
    }


    for(var j = 0; j<7; j++){
        if( (firstday+j) > monthFinalday){
            if(month == 12){
                days.push(String(year+1) + "/" + String(1) + "/" + String(firstday+j-monthFinalday));
            }else{
                days.push(String(year) + "/" + String(month+1) + "/" + String(firstday+j-monthFinalday));
            }
        }else{
            days.push(String(year) + "/" + String(month) + "/" + String(firstday+j));
        }
    }

    return days;
}

function setDays(ds) {
    var d = document.getElementsByClassName("date");
    for(var i = 0; i<7; i++){
        d[i].innerHTML = ds[i];
    }
}

function checkuru(y) {
    if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
        return true;
    }
    return false;
}

function MoveWeek(button) {

    if (button.value == "⇐ Last week") {
        disp_day["day"] -= 7;
        if(disp_day["day"] <= 0){
            if(checkuru(disp_day["year"]) && disp_day["month"] == 3){
                disp_day["month"] = 2;
                disp_day["day"] = maxday[13] + disp_day["day"];
            }else if(disp_day["month"] == 1){
                disp_day["month"] = 12;
                disp_day["year"]--;
                disp_day["day"] = maxday[disp_day["month"]] + disp_day["day"];
            }else{
                disp_day["month"]--;
                disp_day["day"] = maxday[disp_day["month"]] + disp_day["day"];
            }
        }
    } else {
        disp_day["day"] += 7;
        let maxd;

        if(checkuru(disp_day["year"]) && disp_day["month"] == 2){
            maxd = maxday[13];
        }else{
            maxd = maxday[disp_day["month"]];
        }


        if(disp_day["day"] > maxd){
            if(disp_day["month"] == 12){
                disp_day["month"] = 1;
                disp_day["year"] ++;
                disp_day["day"] = disp_day["day"] - maxd;
            }else{
                disp_day["month"]++;
                disp_day["day"] = disp_day["day"] - maxd;
            }
        }
    }

    setDays(getWeekday(disp_day["year"], disp_day["month"], disp_day["day"]));
}
