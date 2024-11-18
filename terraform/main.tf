provider "aws" {
  region = var.aws_region
}

# S3 Bucket
resource "aws_s3_bucket" "static_website" {
  bucket        = var.bucket_name
  force_destroy = true
}
# Disable block public access settings for the bucket
resource "aws_s3_bucket_public_access_block" "static_website" {
  bucket = aws_s3_bucket.static_website.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Enable static website hosting
resource "aws_s3_bucket_website_configuration" "static_website" {
  bucket = aws_s3_bucket.static_website.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Wait for public access block settings to propagate
resource "time_sleep" "wait_for_public_access_block" {
  depends_on      = [aws_s3_bucket_public_access_block.static_website]
  create_duration = "10s"
}

# Add bucket policy
resource "aws_s3_bucket_policy" "static_website" {
  depends_on = [time_sleep.wait_for_public_access_block]
  bucket     = aws_s3_bucket.static_website.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.static_website.arn}/*"
      }
    ]
  })
}

# Optional: Enable versioning
resource "aws_s3_bucket_versioning" "static_website" {
  bucket = aws_s3_bucket.static_website.id
  versioning_configuration {
    status = "Enabled"
  }
}

variable "allowed_ips" {
  description = "List of allowed IP addresses for SSH and monitoring access"
  default     = ["0.0.0.0/0"] # Use for testing, replace with GitHub Actions IPs or specific admin IPs in production
}

# Web Server Security Group
resource "aws_security_group" "web_server" {
  name        = "web-server-sg"
  description = "Security group for web server"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ips
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Monitoring Security Group
resource "aws_security_group" "monitoring" {
  name        = "monitoring-sg"
  description = "Security group for Prometheus and Grafana"

  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = var.allowed_ips
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = var.allowed_ips
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ips
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
# EC2 Instances
resource "aws_instance" "web_server" {
  ami           = var.ami_id
  instance_type = "t2.micro"
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.web_server.id]

  tags = {
    Name = "web-server"
    Role = "nginx"
  }
}

resource "aws_instance" "monitoring" {
  ami           = var.ami_id
  instance_type = "t2.small"
  key_name      = var.key_name

  vpc_security_group_ids = [aws_security_group.monitoring.id]

  tags = {
    Name = "monitoring"
    Role = "prometheus-grafana"
  }
}