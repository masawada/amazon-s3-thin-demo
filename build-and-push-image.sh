#!/usr/bin/env bash

set -eux

docker build . -t amazon-s3-thin-demo-ecs:latest
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
docker tag amazon-s3-thin-demo-ecs:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/amazon-s3-thin-demo:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/amazon-s3-thin-demo:latest
