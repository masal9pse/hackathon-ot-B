# ====================
#
# Provider
#
# ====================
provider "aws" {
  # アクセスキーID・シークレットアクセスキーを直接指定しているサンプルコードをたまに見かけますが、
  # 流出の危険等もあるため、基本的には`aws configure`コマンドでprofileを設定して使うようにしましょう
  profile = "default"
  region  = "ap-northeast-1"
}
