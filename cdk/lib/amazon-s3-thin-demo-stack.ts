import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class AmazonS3ThinDemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc', {
      cidr: '192.168.0.0/24',
      maxAzs: 1,
      subnetConfiguration: [{
        name: 'Public',
        cidrMask: 24,
        subnetType: ec2.SubnetType.PUBLIC
      }],
    });

    const bucket = new s3.Bucket(this, 'bucket');

    const bastion = new ec2.BastionHostLinux(this, 'bastion', { vpc });
    bastion.instance.addUserData(
      'yum -y update',
      'yum -y install gcc',
      'wget https://github.com/tagomoris/xbuild/archive/refs/heads/master.zip -P /tmp',
      'unzip /tmp/master.zip -d /tmp',
      '/tmp/xbuild-master/perl-install 5.36.0 /opt/perl-5.36',
    );
    bucket.grantReadWrite(bastion);
  }
}
