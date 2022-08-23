FROM perl:latest

WORKDIR /app

RUN cpm install https://github.com/masawada/Amazon-S3-Thin/archive/refs/heads/fetch-credentials-from-ecs-role.zip

COPY ./read-file-from-s3-ecs.pl .
COPY ./write-file-to-s3-ecs.pl .
