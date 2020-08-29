'use strict';

const express = require('express');
const router = express.Router();

// ログイン画面の表示
router.get('/', function (request, response, next) {
    response.render('index');
});

// チャット画面の表示
router.post('/room', function (request, response, next) {
    console.log('ユーザ名：' + request.body.userName);
    console.log('現在日時：' + request.body.loginTime);
    // フロント側には正しく受け渡しできた。
    response.render('room', { userName: request.body.userName });
});

module.exports = router;
