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
    if(area=="tl"){
        return "<input id=reply" + num
        + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this, " + '"tl"' +")';>";

    }else if(area=="gr"){
        return "<input id=reply" + num
        + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this, " + '"gr"' +")';>";
    }
}

//取り消しボタンの生成
exports.generate_remove = function(num) {
    return "<input id=remove" + num
        + " type='button' value='取り消し' class='common-button room-publish_button' onclick='remove_message(this)';>";
}

//ユーザー名の整形
exports.add_a_tag = function(username, num, area) {
    if(area=="tl"){
        return "<a href='#' onclick='OnUsernameClick(this, "+'"tl"'+ ");' id=link" + num + ">" + username + "</a>";
    }else if(area=="gr"){
        return "<a href='#' onclick='OnUsernameClick(this, "+'"gr"'+");' id=link" + num + ">" + username + "</a>";
    }
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

