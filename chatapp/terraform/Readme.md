```bash
terraform -v
Terraform v0.12.6

aws --version
aws-cli/2.0.35

このリポジトリをクローンする。

cd terraform && terraform apply 

ssh -i ./example ec2-user@elasticIP

sudo yum update -y && sudo yum install docker git -y && sudo service docker start && git clone https://github.com/rkclhack/hackathon-ot-B.git hackathon && cd hackathon/chatapp

// docker-composeは本番環境でインストールするのに手間取ったので、本番では使わない。

sudo docker build -f Dockerfile --tag  docker-chatapp .

// アプリが落ちた場合は、同じポートでrun
sudo  docker run -it -d -p 80:3000 docker-chatapp

// dbをホスト側にマウントする場合ならこっち
sudo docker run -dp 80:3000  --volume $(pwd)/database/usersdb.sqlite:/app/database/usersdb.sqlite docker-chatapp

exit

terraform destroy
```

## docker-composeで本番環境を構築
```bash
1. sshに接続する
2. sudo yum update -y && sudo yum install docker git -y && sudo service docker start && git clone https://github.com/rkclhack/hackathon-ot-B.git hackathon && sudo chkconfig docker on && sudo usermod -a -G docker ec2-user && sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o  && /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
3. 権限を変更したので、一度exitで抜けて再度ssh
4. cd hackathon/chatapp
5. docker-compose up -d
```

## その他
```
// コンテナに入る => 発表では使わない、障害が起きたらrunで再立ち上げする
sudo docker exec -it container_ID sh

npm run db-create
npm run db-delete 
```

