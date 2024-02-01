output "rendered_policy" {
  value = data.aws_iam_policy_document.ec2_role.json
}