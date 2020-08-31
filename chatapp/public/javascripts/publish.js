'use strict';
// require("date-utils") なぜかできない


//空白文字の正規表現 先頭から末尾まで空白文字
const regex = /^\s*$/;

//DM用の正規表現　@から始まっていたらDM
const dm = /@.*/;

//並び替え用のフラグ
let reverse = false;    // false→新しいもの順　true→古いもの順



// 投稿メッセージをサーバに送信する
function publish(code) {
    const post = $("#post").val();

    //if(code == 13){
    //}
    
    if(post=="投稿"){

        // ユーザ名を取得
        const userName = $("#userName").val();
        console.log(userName);

        // 入力されたメッセージを取得
        const message = $('#message').val();
        console.log("textarea input : "  + message);

        //入力日時を取得
        let now = new Date($.now());
        console.log(now);

        //textareaを空にする
        $('#message').val(" ");

        // 投稿内容を送信
        if(regex.test(message)){
            alert("文章を入力してください");
        }else if(dm.test(message)){
            socket.json.emit("directMessageEvent", {"date":now, "username": userName, "msg":message});    //DM
        }else{
            socket.json.emit("sendMessageEvent", {"date":now, "username": userName, "msg":message});     //投稿
        }
    }else{
        alert("連続して投稿することはできません");
    }

    return false;
}


//待機イベント
socket.on('Pause', function(time){
    if(time==-1){
        $("#post").val("Wait other user");       //連続投稿を阻止 
    }else{
        $("#post").val("Wait time : " + time);   //カウントダウンを投稿ボタンに表示
    }
});


//復帰イベント
socket.on("Ready", function(){
    $("#post").val("投稿");   //投稿ボタンを復活
});

//表示イベント
socket.on('receiveMessageEvent', function (data) {
    console.log(data.username);

    if(reverse){
        $('#thread').append('<div id=message' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
        " : "+ data.msg +'</p>'+ data.rm_button + "</div>");
    }else{
        $('#thread').prepend('<div id=message' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
        " : "+ data.msg +'</p>'+ data.rm_button + "</div>");
    }

    console.log(reverse);
});


//削除イベント
socket.on("removeElementEvent", function (id){
    $("#" + id).remove();
});


//取り消し機能
function remove_message(element){
    const rm_msg = document.getElementById(element.id).parentNode;
    console.log(rm_msg.id);
    socket.emit("removeMessageEvent", rm_msg.id);
}


//DM機能
function OnUsernameClick(element){
    console.log(element.id)
    const to_name = $("#" + element.id).text();
    console.log(to_name);

    $('#message').val("@"+to_name);
}

//並び順の変更
function OnReverse(){
    const thread = document.getElementById("thread");
    const children = thread.children;             //threadの子ノードを取得
    const fragment = document.createDocumentFragment();   // 空のDocumentFragmentノードを作成
    const sort  = $("#sort").val();

    for(let i=children.length-1; i >= 0; i--){
        fragment.insertBefore(children[i], fragment[0]);
    }

    thread.appendChild(fragment);

    switch(sort){
        case "新しいもの順":
            $("#sort").val("古いもの順");
            reverse = true;
            break;

        default:
            $("#sort").val("新しいもの順");
            reverse = false;
            break;
        }
}