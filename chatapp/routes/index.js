'use strict';

const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function(request, response, next) {
    response.render('index');
});

// チャット画面の表示
router.post('/room', function(request, response, next) {
    console.log('ユーザ名：' + request.body.userName);
    console.log('ルーム名：' + request.body.room);
    response.render('room', {
        userName: request.body.userName,
        room: request.body.room,
    });
});

// チャット画面の表示
// router.post('/room2', function(request, response, next) {
//     console.log('ユーザ名：' + request.body.userName);
//     console.log('ルーム名：' + request.body.room);
//     response.render('room2', {
//         userName: request.body.userName,
//         room: request.body.room,
//     });
// });


// sign_upの表示
router.post('/sign_up', function(request, response, next) {
    response.render('sign_up', {
        userName: request.body.userName,
        room: request.body.room,
        password: request.body.password,
    });
});

module.exports = router;
