import json
import urllib.parse
import boto3

print('Loading function')

s3 = boto3.client('s3')


def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))

    # Get the object from the event and show its content type
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        print("CONTENT TYPE: " + response['ContentType'])
        return response['ContentType']
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e
              

## send notification
def send_sns_notification(message):
#    sns_topic_arn = 'your_sns_topic_arn'  # Replace with your SNS topic ARN

    sns_topic_arn= 'arn:aws:sns:us-west-1:398845475087:kafka_file_notify'
    sns_client = boto3.client('sns')
   
    message= "File with specified name uploaded"

    sns_client.publish(
        TopicArn=sns_topic_arn,
        Message=message,
        Subject='File Upload Notification'
    )