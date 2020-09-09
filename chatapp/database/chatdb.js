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
    db.run('CREATE TABLE IF NOT EXISTS chat(id, room, speaker, message, reply)');
    db.run("insert into chat values('@tlmessage-1', 'JavaScript', 'Yamada', 'こんにちは、javascript', '0')");
    db.run("insert into chat values('@tlmessage-2', 'JavaScript', 'masato', 'やあ、javascript', '0')");
    db.run("insert into chat values('@grmessage-3', 'Python', 'Yamada', 'こんにちは、Python', '0')");
    db.run("insert into chat values('@grmessage-4', 'Python', 'masato', 'やあ、Python', '0')");
});
// DBを閉じる
db.close();
