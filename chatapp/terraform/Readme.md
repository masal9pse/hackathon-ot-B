```bash
terraform -v
Terraform v0.12.6

aws --version
aws-cli/2.0.35

このリポジトリをクローンする。

cd terraform && terraform apply 

ssh -i ./example ec2-user@elasticIP

sudo yum update -y && sudo yum install docker git -y && sudo service docker start && git clone https://github.com/rkclhack/hackathon-ot-B.git hackathon && cd hackathon/chatapp


sudo docker build -f Dockerfile --tag  docker-chatapp .

sudo  docker run -it -d -p 8000:3000 docker-chatapp
　　　　　　　　　　　　　or
sudo  docker run -it -d -p 80:3000 docker-chatapp

// dbをホスト側にマウントする場合ならこっち => 基本的に発表で障害が起きたら基本的にマウントせずにコンテナを作り直す。
// docker-composeは本番環境でインストールするのに手間取ったので、本番では使わない。
sudo docker run -dp 80:3000  --volume $(pwd)/database/usersdb.sqlite:/app/database/usersdb.sqlite docker-chatapp

exit

terraform destroy
```

## その他
```
// コンテナに入る => dbの作成、削除はコンテナに入って手動でやったほうがいいのかも
sudo docker exec -it container_ID sh
```

