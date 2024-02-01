def lambda_handler(event, context):
    message = "Hello {} !".format(event['key'])

    return { 'message': message}