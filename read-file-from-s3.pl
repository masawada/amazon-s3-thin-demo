use strict;
use warnings;

use feature 'say';

use Amazon::S3::Thin;

my ($bucket, $key) = @ARGV;

my $s3client = Amazon::S3::Thin->new({
    credential_provider => 'metadata',
    version             => 2,
    region              => 'ap-northeast-1',
});

my $response = $s3client->get_object($bucket, $key);

die $response unless $response->is_success;

say $response->content;
