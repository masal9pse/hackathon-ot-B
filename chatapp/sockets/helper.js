'use strict';
const indention = /\n/g;
const blank = /\s/g;
const large_blank = /　/g;
const wait_time = 6;
let num_message = 0;

exports.num_message = num_message;
exports.wait_time = wait_time;

//replyボタンの生成
exports.generate_reply = function(num, area) {
    if (area == "tl") {
        return "<input id=tlrp" + num
            + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this, " + '"tl"' + ")';>";

    } else if (area == "gr") {
        return "<input id=grrp" + num
        + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this, " + '"gr"' + ")';>";
    
    } else if (area == "dm") {
        return "<input id=dmrp" + num
            + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this, " + '"dm"' + ")';>";
    }
}

//取り消しボタンの生成
exports.generate_remove = function(num) {
    exports.generate_remove = function(num) {
        return "<input id=remove" + num
            + " type='button' value='&#xf2ed; 取り消し' class='fas btn btn-danger' onclick='remove_message(this)';>";
    }
}

//ユーザー名の整形
exports.add_a_tag = function(username, num) {
    return "<a href='#' onclick='OnUsernameClick(this);' id=link" + num + ">" + username + "</a>";
}

//テキストの整形
exports.format = function(text) {
    // 文の初めは改行し、全角スペース4つ分のインデントをとる
    let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;" + text;

    // 改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp
    let formatted_text = pre_text
        .replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;")
        .replace(blank, "&nbsp;")
        .replace(large_blank, "&emsp;");

    return formatted_text;
}


