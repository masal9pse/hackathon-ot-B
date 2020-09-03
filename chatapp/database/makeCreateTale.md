# テーブルとカラムを作る方法

database の階層に入らずに、
chatapp ディレクトリの中で下記コマンドを実装する

```
$ npm install

$ node database/usersdb.js
```

## カラムの確認のしかた

```
$ sqlite3  database/usersdb.sqlite

.schema
```

# その他

```
// 抜け方
.exit
// 問題が起きたらときのテーブルの削除のやり方
drop database users;
```
