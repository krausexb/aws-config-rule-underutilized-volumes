import boto3
import json

client = boto3.client('ec2')

TAG_NAME = "VolumeUnderutilized"
TAG_VALUE_TRUE = "True"
TAG_VALUE_FALSE = "False"

def isInstanceCorrectlyTagged(instance_id, desired_tag_state):
    response = client.describe_tags(
        Filters=[
            {
                'Name': 'resource-id',
                'Values': [
                    instance_id,
                ],
            },
        ],
    )

    print(response)

    for tag in response['Tags']:
        if tag['Key'] == TAG_NAME and tag['Value'] == desired_tag_state:
            print("Instance is already tagged correctly")
            return
        else:
            print("Tagging instance to the desired tag state of: ", desired_tag_state)
            tagInstance(instance_id, desired_tag_state)

def tagInstance(instance_id, desired_tag_state):
    response = client.create_tags(
        Resources=[
            instance_id,
        ],
        Tags=[
            {
                'Key': TAG_NAME,
                'Value': desired_tag_state,
            }
        ]
    )

    print("Response form ec2:create_tags call: ", response)

def getInstanceId(dimensions):
    instance_id = None
    for dimension in dimensions:
        if dimension['name'] == 'InstanceId':
            instance_id = dimension['value']
            break

    if instance_id is not None:
        return instance_id
    else:
        print("InstanceId not found in Dimensions")
        return None

def lambda_handler(event, context):
    message = json.loads(event['Records'][0]['Sns']['Message'])
    dimensions = message['Trigger']['Dimensions']

    if 'OK' in event['Records'][0]['Sns']['Subject']: 
        instance_id = getInstanceId(dimensions)
        isInstanceCorrectlyTagged(instance_id, TAG_VALUE_FALSE)
    elif 'ALARM' in event['Records'][0]['Sns']['Subject']:
        instance_id = getInstanceId(dimensions)
        isInstanceCorrectlyTagged(instance_id, TAG_VALUE_TRUE)
    
    return {
        'statusCode': 200,
    }

