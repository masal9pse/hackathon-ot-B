# ====================
#
# VPC
#
# ====================
resource "aws_vpc" "node-app" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true # DNS解決を有効化
  enable_dns_hostnames = true # DNSホスト名を有効化

  tags = {
    Name = "node-app"
  }
}

# ====================
#
# Subnet
#
# ====================
resource "aws_subnet" "node-app" {
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  vpc_id            = aws_vpc.node-app.id

  # trueにするとインスタンスにパブリックIPアドレスを自動的に割り当ててくれる
  map_public_ip_on_launch = true

  tags = {
    Name = "node-app"
  }
}

# ====================
#
# Internet Gateway
#
# ====================
resource "aws_internet_gateway" "node-app" {
  vpc_id = aws_vpc.node-app.id

  tags = {
    Name = "node-app"
  }
}

# ====================
#
# Route Table
#
# ====================
resource "aws_route_table" "node-app" {
  vpc_id = aws_vpc.node-app.id

  tags = {
    Name = "node-app"
  }
}

resource "aws_route" "node-app" {
  gateway_id             = aws_internet_gateway.node-app.id
  route_table_id         = aws_route_table.node-app.id
  destination_cidr_block = "0.0.0.0/0"
}

resource "aws_route_table_association" "node-app" {
  subnet_id      = aws_subnet.node-app.id
  route_table_id = aws_route_table.node-app.id
}

# ====================
#
# Security Group
#
# ====================
resource "aws_security_group" "node-app" {
  vpc_id = aws_vpc.node-app.id
  name   = "node-app"

  tags = {
    Name = "node-app"
  }
}

# インバウンドルール(ssh接続用)
resource "aws_security_group_rule" "in_ssh" {
  security_group_id = aws_security_group.node-app.id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
}

# インバウンドルール(pingコマンド用)
resource "aws_security_group_rule" "in_icmp" {
  security_group_id = aws_security_group.node-app.id
  type              = "ingress"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = -1
  to_port           = -1
  protocol          = "icmp"
}

resource "aws_security_group_rule" "custom_tcp" {
    security_group_id = aws_security_group.node-app.id
    type              = "ingress"
    from_port         = 3000
    to_port           = 3000
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "node-custom" {
    security_group_id = aws_security_group.node-app.id
    type              = "ingress"
    from_port         = 8000
    to_port           = 8000
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "mongo-sg" {
    security_group_id = aws_security_group.node-app.id
    type              = "ingress"
    from_port         = 27017
    to_port           = 27017
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "mongo"
}

resource "aws_security_group_rule" "production-sg" {
    security_group_id = aws_security_group.node-app.id
    type              = "ingress"
    from_port         = 80
    to_port           = 80
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]
    description       = "production"
}

# アウトバウンドルール(全開放)
resource "aws_security_group_rule" "out_all" {
  security_group_id = aws_security_group.node-app.id
  type              = "egress"
  cidr_blocks       = ["0.0.0.0/0"]
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
}
