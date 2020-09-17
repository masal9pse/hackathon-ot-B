'use strict';
//空白文字の正規表現 先頭から末尾まで空白文字
const regex = /^\s*$/;

//DM用のセリフ
const dm = "Direct Message to ";

//リプライ用の正規表現　message+数字ならリプライ
const reply = /@tlmessage\d*|@reply\d*|@grmessage\d*/;

//並び替え用のフラグ
let reverse = false;    // false→新しいもの順　true→古いもの順

// メッセージ番号 -> 同じメッセージ番号のものを表示しない
let latest_msg_num = -1;


function textarea(area) {
    // ユーザ名を取得
    const userName = $("#" + area + "userName").val();
    console.log(userName);

    // 入力されたメッセージを取得
    const message = $('#' + area + 'message').val();
    console.log("textarea input : " + message);

    // ルームを取得
    const room = $('#' + area + 'room').val();
    console.log("room：" + room);

    //入力日時を取得
    let now = new Date($.now()).toLocaleString();
    console.log(now);

    //textareaを空にする
    $('#' + area + 'message').val(" ");

    return { userName, message, room, now };
}

//並び順の変更
function OnReverse(area) {
    const thread = document.getElementById(area + "thread");
    const children = thread.children;             //threadの子ノードを取得
    const fragment = document.createDocumentFragment();   // 空のDocumentFragmentノードを作成
    const sort = $("#" + area + "sort").val();

    for (let i = children.length - 1; i >= 0; i--) {
        fragment.insertBefore(children[i], fragment[0]);
    }

    thread.appendChild(fragment);

    switch (sort) {
        case "新しいもの順":
            $("#" + area + "sort").val("古いもの順");
            reverse = true;
            break;

        default:
            $("#" + area + "sort").val("新しいもの順");
            reverse = false;
            break;
    }
}

//DM機能
function OnUsernameClick(element) {
    const userName = $("#tluserName").val();
    const to_name = $("#" + element.id).text();
    console.log(to_name);
    $("#dmname").text(dm + to_name);
    socket.emit("initDM", { "my_name": userName, "to_name": to_name });
}

//reply機能
function OnReplyClick(element, area) {
    const to_rp = document.getElementById(element.id).parentNode;
    console.log(to_rp.id);
    $('#' + area + 'message').val("@" + to_rp.id);
}

function remove_message(element) {
    const rm_msg = document.getElementById(element.id).parentNode;
    console.log(rm_msg.id);
    socket.emit("removeMessageEvent", rm_msg.id);
}

//同じ要素があるかをチェック
function idChecker(children, id) {
    // console.log(id);
    if (children.length != 0) {
        for (let i = 0; i < children.length; i++) {
            if (children[i].id == id) {
                console.log(children[i].id);
                console.log(id);
                console.log("表示しない");
                return false;
            }
        }
    }
    return true;
}

//同じ名前があるかをチェック
function nameChecker(children, name) {
    if (children.length != 0) {
        for (let i = 0; i < children.length; i++) {
            if (children[i].textContent == name) {
                console.log(children[i].textContent);
                console.log(name);
                console.log("表示しない");
                return false;
            }
        }
    }
    return true;
}

function remove_bot(ele) {
    const apply = ele.value;
    if (/予定追加/.test(apply)) {
        console.log("予定追加");
        const plan = String($("#bot").text()).split(":");
        console.log(plan[1]);
        console.log(plan[3]);
        if (reg_date.test(plan[3])) {
            socket.json.emit("registerSchedule", {
                "date": plan[3],
                "schedule": plan[1],
                "name": $('#tluserName').val()
            });
        }else{
            console.log("だめ")
        }
    }
    $("#bot").remove();
}

//削除イベント
socket.on("removeElementEvent", function (id) {
    $("#" + id).remove();
});

//秘密兵器イベント
socket.on("botEvent", function (bot) {
    $('#tlthread').append(bot);

});


