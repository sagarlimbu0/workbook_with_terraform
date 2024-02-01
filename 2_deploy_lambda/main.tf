## IAM policy document; statement for creating IAM role= false
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

## IAM Role; attach the poicy (JSON) file
resource "aws_iam_role" "lambda_role_execution" {
  name               = "uploadFile_s3"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# ## Add IAM policy
resource "aws_iam_policy" "lambda_policy" {

  name        = "test_lambda_policy"
  path        = "/"
  description = "AWS IAM Policy for managing aws lambda role"
  policy = jsonencode(
    {
      Version = "2012-10-17",
      Statement = [
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Resource : ["arn:aws:logs:*:*:*"],
        },
        {
          Effect = "Allow"
          Action = [
            "ec2:CreateNetworkInterface",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DeleteNetworkInterface"
          ]
          Resource = ["*"]
      }]
  })
}

# Attach IAM policy to the role; Creates a new IAM policy
resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {
  role       = aws_iam_role.lambda_role_execution.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

## Saving the python code in a zip file 
data "archive_file" "zipped_code" {
  type        = "zip"
  source_dir  = "code/"
  output_path = "code/hello-python.zip"
}

## Add the code to AWS lambda function
resource "aws_lambda_function" "terraform_lambda_func" {
  # filename      = filebase64sha256("./code/hello-python.zip")

  filename      = "./code/hello-python.zip"
  function_name = "uploadFile_s3_vol_1"
  role          = aws_iam_role.lambda_role_execution.arn
  handler       = "index.lambda_handler"
  runtime       = "python3.10"
  # depends_on    = [aws_iam_role_policy_attachment.attach_iam_policy_to_iam_role]


  #create_role = false
  #lambda_role= aws_iam_role.lambda_role_execution.arn
}

