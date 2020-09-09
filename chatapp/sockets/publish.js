// 'use strict';
// const indention = /\n/g;
// const blank = /\s/g;
// const large_blank = /　/g;
// const wait_time = 6;
// let num_message = 0;

// module.exports = function (socket, io, master) {
//     // 投稿メッセージを送信する
//     socket.on('sendMessageEvent', function (data) {
//         if (!data.msg) {
//             return;
//         }

//         console.log(++num_message);
//         console.log(data.date + ":" + data.username + "の入力 :" + data.msg);
//         // console.log(io.sockets.clients());

//         // 自分自身にはbタグをつけた内容を送信
//         // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
//         Object.keys(master[data.username].socketID)
//             .filter((id) => master[data.username].socketID[id] === data.room)
//             .forEach((id) => {
//                 io.to(id).emit("receiveMessageEvent", {
//                     "area": data.area,
//                     "num_message": num_message,
//                     "username": add_a_tag(data.username, num_message),
//                     "date": data.date,
//                     "msg": "<b>" + format(data.msg) + "</b>",
//                     "rp_button": generate_reply(num_message),
//                     "rm_button": generate_remove(num_message)
//                 });
//             });

//         // 他のクライアントには普通に送信
//         // 未実装：チャットルーム内の自分のアカウントには送信しない
//         // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
//         socket.broadcast.to(data.room).emit("receiveMessageEvent", {
//             "area": data.area,
//             "num_message": num_message,
//             "username": add_a_tag(data.username, num_message),
//             "date": data.date,
//             "msg": format(data.msg),
//             "rp_button": generate_reply(num_message),
//             "rm_button": ""
//         });

//         // wait(wait_time, socket, io);　　　　//60秒間投稿禁止

//     });

//     // メッセージ削除イベントを送信する
//     socket.on("removeMessageEvent", function (id) {
//         console.log("remove" + id);
//         io.sockets.emit("removeElementEvent", id);
//     });

//     // DMイベントを送信する
//     socket.on("directMessageEvent", function (data) {
//         console.log(++num_message);
//         console.log(data.date + ":" + data.username + "の入力 :" + data.msg);
//         // console.log(io.sockets.clients());

//         let to_user = String(data.to).replace("@", "").replace("\n", "");

//         console.log(to_user);

//         // 自分自身への送信
//         Object.keys(master[data.username].socketID).forEach((id) => {
//             io.to(id).emit("receiveMessageEvent", {
//                 "area": data.area,
//                 "num_message": num_message,
//                 "username": add_a_tag(data.username, num_message),
//                 "date": data.date,
//                 "msg": "<b>" + format(data.msg) + "</b>",
//                 "rp_button": generate_reply(num_message),
//                 "rm_button": generate_remove(num_message)
//             });
//         });

//         // 特定のユーザに向けての送信
//         Object.keys(master[to_user].socketID).forEach((id) => {
//             io.to(id).emit("receiveMessageEvent", {
//                 "area": data.area,
//                 "num_message": num_message,
//                 "username": add_a_tag(data.username, num_message),
//                 "date": data.date,
//                 "msg": format(data.msg),
//                 "rp_button": generate_reply(num_message),
//                 "rm_button": ""
//             });
//         });

//         // wait(wait_time, socket, io);　　　　//60秒間投稿禁止
//     });

//     // リプライイベントを送信する
//     socket.on("replyMessageEvent", function (data) {
//         console.log(++num_message);
//         console.log(data.date + ":" + data.username + "の入力 :" + data.msg);
//         // console.log(io.sockets.clients());

//         let to_reply = String(data.reply).replace("@", "").replace("\n", "");

//         // 自分自身にはbタグをつけた内容を送信
//         // 同じチャットルームにいる自分のアカウントにのみメッセージを送る
//         Object.keys(master[data.username].socketID)
//             .filter((id) => master[data.username].socketID[id] === data.room)
//             .forEach((id) => {
//                 socket.to(id).emit("receiveReplyMessage", {
//                     "num_message": num_message,
//                     "reply": to_reply,
//                     "username": add_a_tag(data.username, num_message),
//                     "date": data.date,
//                     "msg": "<b>" + format(data.msg) + "</b>",
//                     "rp_button": generate_reply(num_message),
//                     "rm_button": generate_remove(num_message)
//                 });
//             });

//         // 他のクライアントには普通に送信
//         // 未実装：チャットルーム内の自分のアカウントには送信しない
//         // -> 特定のクライアントに送信しない方法が分からなかったので，クライアント側で対処
//         socket.broadcast.to(data.room).emit("receiveReplyMessage", {
//             "area": data.area,
//             "num_message": num_message,
//             "reply": to_reply,
//             "username": add_a_tag(data.username, num_message),
//             "date": data.date,
//             "msg": format(data.msg),
//             "rp_button": generate_reply(num_message),
//             "rm_button": ""
//         });

//         // wait(wait_time, socket, io);　　　　//60秒間投稿禁止

//     });

//     // メモイベントを送信する
//     socket.on("sendMemoEvent", function (data) {
//         Object.keys(master[data.user].socketID).forEach((id) => {
//             io.to(id).emit("receiveMemoEvent", {
//                 user: data.user,
//                 msg: data.msg,
//                 date: data.date,
//             });
//         });
//     });
// };

// //replyボタンの生成
// function generate_reply(num) {
//     return "<input id=reply" + num
//         + " type='button' value='Reply' class='common-button room-publish_button' onclick='OnReplyClick(this)';>";
// }

// //取り消しボタンの生成
// function generate_remove(num) {
//     return "<input id=remove" + num
//         + " type='button' value='取り消し' class='common-button room-publish_button' onclick='remove_message(this)';>";
// }

// //ユーザー名の整形
// function add_a_tag(username, num) {
//     return "<a href='#' onclick='OnUsernameClick(this);' id=link" + num + ">" + username + "</a>";
// }

// //テキストの整形
// function format(text) {
//     // 文の初めは改行し、全角スペース4つ分のインデントをとる
//     let pre_text = "<br>&emsp;&emsp;&emsp;&emsp;" + text;

//     // 改行→改行＋インデント　半角空白→＆nbsp 全角空白→&emsp
//     let formatted_text = pre_text
//         .replace(indention, "<br>&emsp;&emsp;&emsp;&emsp;")
//         .replace(blank, "&nbsp;")
//         .replace(large_blank, "&emsp;");

//     return formatted_text;
// }

// //待機する関数
// function wait(time, socket, io) {
//     let count = time;

//     var intervalID = setInterval(() => {    //1秒ごとにカウントダウン
//         io.sockets.emit('Pause', count--);
//         console.log(count);
//     }, 1000);

//     setTimeout(() => {
//         clearInterval(intervalID);
//         socket.broadcast.emit("Ready");     //Readyイベントを発行　
//         socket.emit("Pause", -1);
//     }, (time + 1) * 1000);
// }
