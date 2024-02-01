# resources defined for the infrastructure
resource "aws_instance" "my-machine"{
    ami= var.ami
    instance_type= var.instance_type
}