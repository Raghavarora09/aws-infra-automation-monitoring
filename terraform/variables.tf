variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-south-1"
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
  sensitive   = true
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
  sensitive   = true
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
}

variable "key_name" {
  description = "SSH key pair name"
  type        = string
}

variable "admin_ip" {
  description = "Admin IP address for SSH access"
  type        = string
}


variable "ami_id" {
  description = "AMI ID for EC2 instances"
  default     = "ami-09b0a86a2c84101e1"
}
