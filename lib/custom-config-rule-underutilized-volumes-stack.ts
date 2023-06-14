import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as config from 'aws-cdk-lib/aws-config';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CustomConfigRuleUnderutilizedVolumesStack
 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const configRuleFunction = new lambda.Function(this, 'ConfigRuleUnderutilizedVolumes', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'detect_instances.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_9,
    });

    const customRule = new config.CustomRule(this, 'CustomRule', {
      configRuleName: "ec2-instances-with-underutilized-volumes",
      configurationChanges: true,
      lambdaFunction: configRuleFunction,
      description: 'Custom rule to check for underutilized volumes',
      ruleScope: config.RuleScope.fromResources([config.ResourceType.EC2_INSTANCE]),
      inputParameters: {
        "VolumeUnderutilized": "False"
      },
    });

    const configPrincipal = new iam.ServicePrincipal('config.amazonaws.com');
    configRuleFunction.grantInvoke(configPrincipal);
  }
}