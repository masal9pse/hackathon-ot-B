// sqlite3を使う準備
var sqlite3 = require('sqlite3').verbose();
// :memory:を指定すると揮発性のDB
// DBファイルを指定して、永続化したDBにする
var db = new sqlite3.Database('./database/chat.sqlite'); //データベースを新規に開く

// serialize関数を使うと、それぞれの行が実行されたら、次の行が実行される。
// parallel関数を用いることで、平行実行もできる。
db.serialize(function () {
 // テーブル作成
 //※　"IF NOT EXISTS"の部分は同名のテーブルが無い場合は、このままテーブルを作成。
 //既に同名テーブルがある時は何も処理せず終了。
 db.run('CREATE TABLE IF NOT EXISTS Users(name, password,socketid)');

 // // データ登録
 // var stmt = db.prepare('INSERT INTO items VALUES(?,?)');
 // for (var i = 0; i < 10; i++)
 //     stmt.run(["items " + i, 5 * i]);
 // stmt.finalize();
 // // データをコンソールに出力、参照する。
 // // 引数(row)のプロパティに、SELECT句で指定した要素がある。「row.name」等で値を取得
 // db.each("SELECT rowid AS id, * FROM items", function (err, row) {
 //     console.log(row.id + " : " + row.name + ":" + row.value);
 // });
});
// DBを閉じる
db.close();
