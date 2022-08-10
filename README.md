# Amazon::S3::Thin Demo

Demonstration of Amazon::S3::Thin to obtain permissions from an IAM Role attached to an EC2

## Usage

Create an EC2 instance and S3 bucket with following commands:

```
$ cd cdk
$ npx cdk bootstrap
$ npx cdk deploy
```

Connect to the instance with Session Manager and execute followings:

```
$ cd ~ssm-user
$ wget https://github.com/masawada/amazon-s3-thin-demo/archive/refs/heads/main.zip
$ unzip main.zip
$ mv amazon-s3-thin-demo-main amazon-s3-thin-demo
$ cd ~/amazon-s3-thin-demo/
$ export PATH=/opt/perl-5.36/bin:$PATH
$ carton
$ carton exec -- perl ./write-message-to-s3.pl BUCKET_NAME KEY MESSAGE
$ carton exec -- perl ./read-message-from-s3.pl BUCKET_NAME KEY
```
