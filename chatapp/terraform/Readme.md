参考サイト ssh
# EC2でnode+sqliteの環境構築
https://qiita.com/oishihiroaki/items/bc663eb1282d87c46e97
# foreverのインストール
https://qiita.com/daikon_buu/items/c05d75262be8de413812
# そのリポジトリのイメージとコンテナ作成の参考
https://github.com/self-tuts/Nodejs-application-with-docker

https://cloudpack.media/31772

```bash
このリポジトリをクローンする。

cd terraform && terraform apply 

ssh -i ./example ec2-user@elasticIP

sudo yum update -y && sudo yum install docker git -y && sudo service docker start && git clone https://github.com/rkclhack/hackathon-ot-B.git hackathon && cd hackathon/chatapp


sudo docker build -f Dockerfile --tag  docker-chatapp .

sudo  docker run -it -d -p 8000:3000 docker-chatapp
// dbをホスト側にマウントする場合ならこっち
sudo docker run -dp 80:3000  --volume $(pwd)/database/usersdb.sqlite:/app/database/usersdb.sqlite docker-chatapp

exit

terraform destroy
```

