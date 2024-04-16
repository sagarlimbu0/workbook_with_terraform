# Workbook with Terraform
## Setting up Terraform Environment

### Step 1: Install Terraform
- Visit the [Terraform website](https://www.terraform.io/downloads.html) to download the appropriate binary for your operating system.
- Follow the installation instructions provided for your specific platform.

### Step 2: Verify Installation
- Open a terminal or command prompt.
- Type `terraform version` and press Enter.
- You should see the installed version of Terraform displayed. This confirms that Terraform has been successfully installed.

### Step 3: Configure AWS Credentials
- If you don't have an AWS account, sign up for one [here](https://aws.amazon.com/).
- Log in to your AWS Management Console.
- Navigate to the IAM (Identity and Access Management) service.
- Create a new IAM user with programmatic access.
- Attach the necessary permissions policies to the user for the AWS services you intend to manage with Terraform (e.g., AmazonEC2FullAccess, AmazonS3FullAccess).
- Once the user is created, note down the Access Key ID and Secret Access Key.

### Step 4: Configure Terraform to Use AWS Credentials
- In your terminal or command prompt, navigate to the directory where you plan to work with Terraform.
- Create a new file named `credentials.tf` or any other appropriate name.
- Add the following content to the file, replacing `YOUR_ACCESS_KEY` and `YOUR_SECRET_KEY` with the respective values obtained in Step 3:

```hcl
provider "aws" {
  access_key = "YOUR_ACCESS_KEY"
  secret_key = "YOUR_SECRET_KEY"
  region     = "us-west-2" // Modify the region as per your requirement
}
```

### Step 5: Initialize Terraform Configuration
- Run `terraform init` in your terminal.
- This command initializes Terraform in the current directory, downloading any necessary plugins and modules.

## Working with Terraform

### Step 6: Write Terraform Configuration
- Create a new `.tf` file in your working directory (e.g., `main.tf`).
- Write Terraform configuration code to define the AWS resources you want to create or manage. Refer to the [Terraform documentation](https://www.terraform.io/docs/providers/aws/index.html) for guidance on resource configuration.

### Step 7: Test and Validate Configuration
- Run `terraform validate` to check the syntax and validity of your Terraform configuration.
- Fix any errors or warnings reported by the validation process.

### Step 8: Plan Infrastructure Changes
- Run `terraform plan` to generate an execution plan.
- Review the proposed changes to ensure they align with your expectations.
- Verify that no unintended changes will occur.

### Step 9: Apply Changes
- Run `terraform apply` to apply the changes defined in your Terraform configuration.
- Confirm the changes when prompted by Terraform.
- Wait for Terraform to provision the infrastructure.

### Step 10: Clean Up (Optional)
- If you no longer need the provisioned resources, run `terraform destroy` to tear down the infrastructure.
- Confirm the destruction when prompted by Terraform.

## ISSUE when pushing Terraform code to GitHub

If you encounter issues when pushing Terraform code to GitHub, such as the repository being prevented from uploads, it may be due to sensitive information or cached files within the Terraform directory. Follow these steps to address the issue:

- **Ignore Terraform Cached Files**:
  - Ensure that Terraform's directory, typically named `.terraform`, which holds cached files, is ignored during version control.
  - One possible solution involves using the following command:
    ```
    git filter-branch -f --index-filter 'git rm --cached -r --ignore-unmatch .terraform/'
    ```
- **Alternative Approach**:
  - Another approach involves removing every `.terraform` directory from subdirectories.
  - Execute the following command from the root directory of your repository:
    ```
    find . -type d -name '.terraform' -exec rm -r {} +
    ```
- **Remove State Files**:
  - Additionally, to prevent state files from being uploaded, you can remove them using:
    ```
    find . -name '*.backup' -delete
    ```
