############################################################
## Creating several steps to deploy different AWS services;
## 1. Creating a S3 bucket to store the `application's` archived application zipped folder
## using KMS key for encryption

## AWS KMS key creation
resource "aws_kms_key" "myKMS" {
  description             = "KMS Key 1"
  deletion_window_in_days = 7
}

#############################################################
## 1. Create/Deploy S3 bucket
## note: only alphanumeric and hypens allowed for naming
resource "aws_s3_bucket" "climate-web-app" {
  bucket = "climate-web-app"
}

## AWS S3 ACL 
# resource "aws_s3_bucket_acl" "myACL" {
#   bucket = aws_s3_bucket.climate-web-app.id
#   acl    = "private"
# }

## ordering the resource is important; define the acl before s3 acl ownership
## AWS ACL to get access to S3 files which stores the application code

## AWS S3 ACL ownership
resource "aws_s3_bucket_ownership_controls" "default" {
  bucket = aws_s3_bucket.climate-web-app.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

## s3 bucket ACL
resource "aws_s3_bucket_acl" "default" {
  depends_on = [aws_s3_bucket_ownership_controls.default]

  bucket = aws_s3_bucket.climate-web-app.id
  acl    = "private"
}


####################################################
## S3 Key Object 
## specify the application zip folder from s3 bucket
resource "aws_s3_object" "web_app_object" {
  
  bucket     = aws_s3_bucket.climate-web-app.id
  key        = "climate_web_app.zip"
  source     = "../../application/climate_web_app.zip"
  kms_key_id = aws_kms_key.myKMS.arn
}

############################################################
## AWS vpc



############################################################
## Create Elastic Beanstalk application

resource "aws_elastic_beanstalk_application" "default" {
  name        = "merra-app"
  description = "Testing Merra Application"
}

############################################################
## Create Elastic Beanstalk Version

resource "aws_elastic_beanstalk_application_version" "eb_first_version" {
  name        = "first_version_label"
  application = "merra-app"
  description = "application first version"
  bucket      = aws_s3_bucket.climate-web-app.id
  key         = aws_s3_object.web_app_object.id

}

############################################################
## Create Elastic Beanstalk Environment
## Set the env. based on provided settings

resource "aws_elastic_beanstalk_environment" "eb_beanstalk_env" {

  name = "eb-merra-testing"
  application         = aws_elastic_beanstalk_application.default.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.0.6 running Python 3.11"


  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }

  setting {
    namespace = "aws:elasticbeanstalk:environment:process:default"
    name      = "MatcherHTTPCode"
    value     = "200"
  }
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "LoadBalancerType"
    value     = "application"
  }
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.medium"
  }
  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBScheme"
    value     = "internet facing"
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MinSize"
    value     = 1
  }
  setting {
    namespace = "aws:autoscaling:asg"
    name      = "MaxSize"
    value     = 2
  }
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }
}

