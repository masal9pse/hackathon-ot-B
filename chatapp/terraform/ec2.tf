# ====================
#
# AMI
#
# ====================
# 最新版のAmazonLinux2のAMI情報
data "aws_ami" "node-app" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "block-device-mapping.volume-type"
    values = ["gp2"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

# ====================
#
# EC2 Instance
#
# ====================
resource "aws_instance" "node-app" {
  ami                    = data.aws_ami.node-app.image_id
  vpc_security_group_ids = [aws_security_group.node-app.id]
  subnet_id              = aws_subnet.node-app.id
  key_name               = aws_key_pair.node-app.id
  instance_type          = "t2.micro"

  tags = {
    Name = "node-app"
  }
}

# ====================
#
# Elastic IP
#
# ====================
resource "aws_eip" "node-app" {
  instance = aws_instance.node-app.id
  vpc      = true
}

# ====================
#
# Key Pair
#
# ====================
resource "aws_key_pair" "node-app" {
  key_name   = "node-app"
  public_key = file("./example.pub") # 先程`ssh-keygen`コマンドで作成した公開鍵を指定
}
