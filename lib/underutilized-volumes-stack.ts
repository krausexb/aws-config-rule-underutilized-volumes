import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { SnsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

export class UnderutilizedVolumesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, 'UnderutilizedVolumesLambdaFunction', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'state_handler.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
    });

    const volumeUnderutilizedConditionOK  = new sns.Topic(this, 'VolumeUnderutilizedConditionOK');
    const volumeUnderutilizedConditionInAlarm = new sns.Topic(this, 'VolumeUnderutilizedConditionInAlarm');

    lambdaFunction.addEventSource(new SnsEventSource(volumeUnderutilizedConditionOK));
    lambdaFunction.addEventSource(new SnsEventSource(volumeUnderutilizedConditionInAlarm));

    const lambdaVolumeUnderutilizedPolicy = new iam.PolicyStatement({
      actions: ['ec2:DescribeTags', 'ec2:CreateTags'],
      resources: ['*'],
    });

    lambdaFunction.addToRolePolicy(lambdaVolumeUnderutilizedPolicy);
  }
}