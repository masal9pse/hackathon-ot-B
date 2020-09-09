// 'use strict';
// // require("date-utils")? なぜかで?きない


// //空白文字の正規表現 先頭から末尾まで空白文字
// const regex = /^\s*$/;

// //DM用の正規表現　@から始まっていたらDM
// const dm = /@.*\n/;

// //リプライ用の正規表現　message+数字ならリプライ
// const reply = /@message\d*|@reply\d*/;

// //並び替え用のフラグ
// let reverse = false;    // false→新しいもの順　true→古いもの順

// // const notifier = require("node-notifier");

// // メッセージ番号 -> 同じメッセージ番号のものを表示しない
// let latest_msg_num = -1;

// //どこの投稿かを判別する正規表現
// const reg_area = /\w*_\w*_/;

// // 投稿メッセージをサーバに送信する
// function publish(element) {
//     // const post = $("#post").val();
//     const post = "投稿";

//     if (post=="投稿") {

//         //どこのチャットかを取得
//         const area = String(element).match(reg_area)[0];
//         console.log(area);

//         // ユーザ名を取得
//         const userName = $("#userName").val();
//         console.log(userName);

//         // 入力されたメッセージを取得
//         const message = $('#'+area+'message').val();
//         console.log("textarea input : "  + message);

//         // ルームを取得
//         const room = $('#room').val();
//         console.log("room：" + room);

//         //入力日時を取得
//         let now = new Date($.now()).toLocaleString();
//         console.log(now);

//         //textareaを空にする
//         $('#'+area+'message').val(" ");

//         // 投稿内容を送信
//         if (regex.test(message)) {
//             alert("文章を入力してください");
//         } else if (reply.test(message)) {
//             console.log("to " + message.match(reply));
//             socket.json.emit("replyMessageEvent", {
//                 "area" : area,
//                 "date":now,
//                 "reply": message.match(reply),
//                 "username": userName,
//                 "room":room,"msg":message
//             });    //reply
//         } else if (dm.test(message)) {
//             console.log("to " + message.match(dm));
//             socket.json.emit("directMessageEvent", {
//                 "area" : area,
//                 "date":now,
//                 "to": message.match(dm),
//                 "username": userName,
//                 "room":room,
//                 "msg":message
//             });    //DM
//         } else {
//             socket.json.emit("sendMessageEvent", {
//                 "area" : area,
//                 "date":now,
//                 "username": userName,
//                 "room": room,
//                 "msg":message
//             });     //投稿
//         }
//     } else {
//         alert("連続して投稿することはできません");
//     }

//     return false;
// }


// //待機イベント
// socket.on('Pause', function (time) {
//     if (time === -1) {
//         $("#post").val("Wait other user");       //連続投稿を阻止 
//     } else {
//         $("#post").val("Wait time : " + time);   //カウントダウンを投稿ボタンに表示
//     }
// });


// //復帰イベント
// socket.on("Ready", function () {
//     $("#post").val("投稿");   //投稿ボタンを復活
// });

// //表示イベント
// socket.on('receiveMessageEvent', function (data) {
//     console.log(data.username);

//     if (data.num_message !== latest_msg_num) { // 同じメッセージ番号のものを表示しない
//         if(reverse){
//             $('#'+data.area+'thread').append('<div id=' + data.area+ 'message' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
//             " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
//         }else{
//             $('#'+data.area+'thread').prepend('<div id=' + data.area+ 'message' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
//             " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
//         }
//     }

//     // メッセージ番号を更新
//     latest_msg_num = data.num_message;

//     // notifier.notify({
//     //     'title': '最小限のnode-notifier',
//     //     'message': 'Hello Notification!!'
//     //   });    

// });

// //replyイベント
// socket.on("receiveReplyMessage", function (data) {
//     if (data.num_message !== latest_msg_num) { // 同じメッセージ番号のものを表示しない
//         const reply = String(data.reply);
//         $("#"+reply).append('<div id=reply' + data.num_message + ">" + "<p>"+ data.date + " : " + data.username +
//         " : "+ data.msg +'</p>'+ data.rp_button + data.rm_button + "</div>");
//     }

//     // メッセージ番号を更新
//     latest_msg_num = data.num_message;
// });


// //削除イベント
// socket.on("removeElementEvent", function (id) {
//     $("#" + id).remove();
// });



// //取り消し機能
// function remove_message(element) {
//     const rm_msg = document.getElementById(element.id).parentNode;
//     console.log(rm_msg.id);
//     socket.emit("removeMessageEvent", rm_msg.id);
// }


// //DM機能
// function OnUsernameClick(element) {


//     const to_name = $("#" + element.id).text();
//     const area = String(document.getElementById(element.id).closest("div").id).match(reg_area);

//     console.log(to_name);
//     console.log(area);
//     $('#'+area+'message').val("@"+to_name);
// }

// //reply機能
// function OnReplyClick(element) {
//     const to_rp = document.getElementById(element.id).parentNode;
//     console.log(to_rp.id);
//     $('#message').val("@"+to_rp.id);
// }

// //並び順の変更
// function OnReverse() {
//     const thread = document.getElementById("thread");
//     const children = thread.children;             //threadの子ノードを取得
//     const fragment = document.createDocumentFragment();   // 空のDocumentFragmentノードを作成
//     const sort = $("#sort").val();

//     for (let i=children.length-1; i >= 0; i--) {
//         fragment.insertBefore(children[i], fragment[0]);
//     }

//     thread.appendChild(fragment);

//     switch (sort) {
//         case "新しいもの順":
//             $("#sort").val("古いもの順");
//             reverse = true;
//             break;

//         default:
//             $("#sort").val("新しいもの順");
//             reverse = false;
//             break;
//         }
// }