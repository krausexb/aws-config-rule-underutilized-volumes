#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UnderutilizedVolumesStack } from '../lib/underutilized-volumes-stack';
import { CustomConfigRuleUnderutilizedVolumesStack } from '../lib/custom-config-rule-underutilized-volumes-stack';

const app = new cdk.App();
new UnderutilizedVolumesStack(app, 'UnderutilizedVolumesStack', {
});

new CustomConfigRuleUnderutilizedVolumesStack(app, 'CustomConfigRuleUnderutilizedVolumesStack', {
});