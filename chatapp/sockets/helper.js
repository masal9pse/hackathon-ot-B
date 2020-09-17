'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 7;

const { PythonShell } = require('python-shell');
//const pyShell = new PythonShell("./sockets/python/test.py");

exports.num_message = num_message;
exports.wait_time = wait_time;


//replyボタンの生成
exports.generate_reply = function (num, area) {
    if (area == "tl") {
        return "<input id=tlrp" + num
            + " type='button' value='&#xf086;　返信' class='fas btn btn-success common-button room-publish_button' onclick='OnReplyClick(this, " + '"tl"' + ")';>";

    } else if (area == "gr") {
        return "<input id=grrp" + num
            + " type='button' value='&#xf086; 返信' class='fas btn  btn-info' onclick='OnReplyClick(this, " + '"gr"' + ")';>";

    } else if (area == "dm") {
        return "<input id=dmrp" + num
            + " type='button' value='&#xf086; 返信' class='fas btn  btn-danger common-button room-publish_button' onclick='OnReplyClick(this, " + '"dm"' + ")';>";
    }
}

//取り消しボタンの生成
exports.generate_remove = function (num) {
    return "<input id=remove" + num
        + " type='button' value='&#xf2ed; 取り消し' class='fas btn btn-danger ml-3' onclick='remove_message(this)';>";
}

//ユーザー名の整形
exports.add_a_tag = function (username, num) {
    return "<a href='#' onclick='OnUsernameClick(this);' id=link" + num + ">" + username + "</a>";
}

//テキストの整形
exports.format = function (text) {
    // 文の初めは改行し、全角スペース4つ分のインデントをとる
    let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;" + text;

    // 改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp
    let formatted_text = pre_text
        .replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;")
        .replace(blank, "&nbsp;")
        .replace(large_blank, "&emsp;");

    return formatted_text;
}

exports.bot = function (text, io, room) {
    const options = {
        mode: 'text',
        pythonPath: '/Users/teranishidaina/opt/anaconda3/envs/dialog/bin/python', // which python で表示された結果を指定してください！
        pythonOptions: ['-u'], // get print results in real-time
        args: text
    };
    PythonShell.run("./sockets/python/test.py", options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        if (results.indexOf("0") >= 0) {
            return false;
        } else {
            let bot = '<div id=bot> <p> <br> 予定:' + results[0] + ":" +
            '<br> date:' + results[1]  + '</p>' +"<input id=removebot type='button' value='&#xf2ed; 予定追加' class='fas btn btn-danger ml-3' onclick='remove_bot(this)';>"
             + "<input id=removebot type='button' value='&#xf2ed; 結構です' class='fas btn btn-success common-button room-publish_button' onclick='remove_bot(this)';>" +"</div>";

            io.to(room).emit("botEvent", bot);
            return false;
        }
    });
}


