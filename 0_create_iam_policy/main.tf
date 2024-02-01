## define the exising s3 bucket
resource "aws_s3_bucket" "example" {
  bucket = "my-portfolio-dev"
}

## define the first policy; S3
data "aws_iam_policy_document" "s3_list_files" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["123456789012"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.example.arn,
      "${aws_s3_bucket.example.arn}/*",
    ]
  }
}
## S3 bucket policy
resource "aws_s3_bucket_policy" "allow_access_from_another_account" {
  bucket = aws_s3_bucket.example.id
  policy = data.aws_iam_policy_document.s3_list_files.json
}

## define second policy; ec2 role and pass as JSON file
data "aws_iam_policy_document" "ec2_role" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

  }
}

## AWS IAM role
resource "aws_iam_role" "ec2_role_test" {
  name               = "ec2_role_test"
  assume_role_policy = data.aws_iam_policy_document.ec2_role.json
}

## AWS IAM policy
resource "aws_iam_policy" "ec2_policy" {

  name   = "aws_iam_policy_for_ec2_role"
  path   = "/"
  policy = data.aws_iam_policy_document.ec2_role_test.json

}

## Attach the IAM policy 
resource "aws_iam_role_policy_attachment" "attach_iam_policy_to_iam_role" {

  role       = aws_iam_role.ec2_role_test.name
  policy_arn = aws_iam_policy.ec2_policy.arn
}

