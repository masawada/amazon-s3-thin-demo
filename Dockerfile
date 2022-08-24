FROM perl:latest

WORKDIR /app

RUN cpm install Amazon::S3::Thin

COPY ./read-file-from-s3-ecs.pl .
COPY ./write-file-to-s3-ecs.pl .
