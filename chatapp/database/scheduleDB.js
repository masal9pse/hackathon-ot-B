// sqlite3を使う準備
var sqlite3 = require('sqlite3').verbose();
// :memory:を指定すると揮発性のDB
// DBファイルを指定して、永続化したDBにする
var db = new sqlite3.Database('./database/usersdb.sqlite'); //データベースを新規に開く

// serialize関数を使うと、それぞれの行が実行されたら、次の行が実行される。
// parallel関数を用いることで、平行実行もできる。
db.serialize(function () {
    // テーブル作成
    //※　"IF NOT EXISTS"の部分は同名のテーブルが無い場合は、このままテーブルを作成。
    //既に同名テーブルがある時は何も処理せず終了。
    db.run('CREATE TABLE IF NOT EXISTS schedule(username char(50) not null, plan char(50) not null, date DATE CHECK( date like "____-__-__"))');
    db.run("insert into schedule values('Yamada', 'ラクスのインターンシップ', '2020-09-17')");
    db.run("insert into schedule values('Yamada', '学校の課題' ,'2020-09-18')");
    db.run("insert into schedule values('masato', 'バーベキュー' , '2020-09-18')"); 
});
// DBを閉じる
db.close();
