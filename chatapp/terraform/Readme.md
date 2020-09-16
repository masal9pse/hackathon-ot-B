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

// アプリが落ちていない場合の不具合はポートを変えてrun
// アプリが落ちた場合は、同じポートでrun
sudo  docker run -it -d -p 8000:3000 docker-chatapp　　　　　　　　　　　　　
sudo  docker run -it -d -p 80:3000 docker-chatapp
sudo  docker run -it -d -p 3000:3000 docker-chatapp
sudo  docker run -it -d -p 3001:3000 docker-chatapp
sudo  docker run -it -d -p 27017:3000 docker-chatapp

// dbをホスト側にマウントする場合ならこっち => もし発表で何かしら障害が起きた時、マウントしていると再度立ち上げたコンテナにも影響がでるので今回はマウントしない。
sudo docker run -dp 80:3000  --volume $(pwd)/database/usersdb.sqlite:/app/database/usersdb.sqlite docker-chatapp

exit

terraform destroy
```

## その他
```
// コンテナに入る => 発表では使わない、障害が起きたらrunで再立ち上げする
sudo docker exec -it container_ID sh

npm run db-create
npm run db-delete 
```

