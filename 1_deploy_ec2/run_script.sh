#! /bin/bash

terraform plan

terraform apply -auto-approve

terraform apply -destroy