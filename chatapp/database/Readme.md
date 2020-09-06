# テーブルとカラムを作る方法

database の階層に入らずに、
chatapp ディレクトリの中で下記コマンドを実装する

```
$ npm install

$ node database/usersdb.js
```

## カラム、データ確認のしかた

```
$ sqlite3  database/usersdb.sqlite

// カラムチェック
sqlite> .schema

// データチェック
sqlite> select * from users;
```

# その他

```
// 抜け方
.exit
// 問題が起きたときのテーブルの削除のやり方
drop database users;
```
