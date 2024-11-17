
# outputs.tf
output "web_server_public_ip" {
  value = aws_instance.web_server.public_ip
}

output "monitoring_public_ip" {
  value = aws_instance.monitoring.public_ip
}

output "s3_bucket_name" {
  value = aws_s3_bucket.static_website.id
}