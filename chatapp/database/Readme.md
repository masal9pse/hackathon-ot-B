# テーブルとカラムを作る方法

/databaseディレクトリの階層には入らずに、
chatapp ディレクトリの中で下記コマンドを実装する

```
// package.jsonに記載されているsqlite3をインストールするためです。
$ npm install

$ node database/usersdb.js

// 同時にusersテーブルとchatテーブルを作りたい場合
$ npm run db-create
```

## カラム、データ確認するやりかた

```
// db内に入るコマンド
$ sqlite3  database/usersdb.sqlite

// テーブルとカラムチェック
sqlite> .schema

// テーブルに入っているデータをチェック
sqlite> select * from users;
```

# その他

```
// 抜け方
sqlite> .exit

// 問題が起きたときのテーブルの削除のやり方
sqlite> drop table users;

// テーブルではなくdbごと削除してしまいたい場合はusersdb.sqliteを削除するかこのコマンドを実行
$ npm run db-delete
```
