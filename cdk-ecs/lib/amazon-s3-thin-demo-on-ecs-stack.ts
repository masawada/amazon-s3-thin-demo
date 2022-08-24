import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class AmazonS3ThinDemoOnEcsStack extends Stack {
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
    const executionRole = new iam.Role(this, 'execution-role', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'),
      ],
    });
    const taskRole = new iam.Role(this, 'role-for-bucket', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    taskRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: ['*'],
    }));
    bucket.grantReadWrite(taskRole);

    const repository = new ecr.Repository(this, 'repository', {
      repositoryName: 'amazon-s3-thin-demo'
    });

    const readTaskDefinition = new ecs.FargateTaskDefinition(this, 'read-task-definition', {
      cpu: 256,
      memoryLimitMiB: 512,
      taskRole,
      executionRole,
    });
    readTaskDefinition.addContainer('container', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      command: 'perl -I/app/local/lib/perl5 ./read-file-from-s3-ecs.pl hello.txt'.split(' '),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'amazon-s3-thin-demo' }),
    });

    const writeTaskDefinition = new ecs.FargateTaskDefinition(this, 'write-task-definition', {
      cpu: 256,
      memoryLimitMiB: 512,
      taskRole,
      executionRole,
    });
    writeTaskDefinition.addContainer('container', {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      command: 'perl -I/app/local/lib/perl5 ./write-file-to-s3-ecs.pl hello.txt helloworld'.split(' '),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
      logging: ecs.LogDriver.awsLogs({ streamPrefix: 'amazon-s3-thin-demo' }),
    });

    const cluster = new ecs.Cluster(this, 'cluster', { vpc });
  }
}
