use strict;
use warnings;

use feature 'say';

use Amazon::S3::Thin;

my $bucket = $ENV{BUCKET_NAME};
my ($key, $content) = @ARGV;

my $s3client = Amazon::S3::Thin->new({
    credential_provider => 'ecs_container',
    region              => 'ap-northeast-1',
});

my $response = $s3client->put_object($bucket, $key, $content);

die $response unless $response->is_success;

say $response->content;
