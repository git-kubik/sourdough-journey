# Docker Registry Push and Deploy Guide

## Overview

This document provides comprehensive instructions for pushing images to the private Docker registry and deploying them to worker nodes in the Docker Swarm cluster.

## Cluster Configuration

### Infrastructure
- **Manager Node**: `10.9.8.120` (swarm-manager)
- **Worker Nodes**: 
  - `10.9.8.121` (swarm-worker-1) - *Registry host*
  - `10.9.8.122` (swarm-worker-2)
  - `10.9.8.123` (swarm-worker-3)
- **Private Registry**: `10.9.8.121:5000`

### Authentication Details
- **Registry URL**: `10.9.8.121:5000`
- **Username**: `admin`
- **Password**: `admin123`
- **Registry Type**: Insecure (HTTP-based)

## Security Features

### Secure Credential Management
The cluster implements enhanced security for registry credentials:

- **Secure Storage**: Credentials stored in `/etc/docker/creds/registry-auth` with mode 600
- **Login Script**: `/etc/docker/creds/login-registry.sh` for secure authentication
- **Logout Script**: `/etc/docker/creds/logout-registry.sh` for secure logout
- **Docker Swarm Secret**: `registry-auth` for service deployments
- **Credential Rotation**: `/etc/docker/creds/rotate-credentials.sh` for password updates

### Configuration Status
- All nodes configured to accept the insecure registry `10.9.8.121:5000`
- Docker daemon configured with `insecure-registries` setting
- Secure credential scripts deployed on all nodes

## Step-by-Step Instructions

### 1. Pushing Images to Registry

#### Prerequisites
- SSH access to cluster nodes
- Image ready for deployment (built locally or pulled from public registry)

#### Process

1. **Connect to Manager Node**
   ```bash
   ssh m@10.9.8.120
   ```

2. **Secure Registry Login**
   ```bash
   sudo /etc/docker/creds/login-registry.sh
   ```
   Expected output: `Login Succeeded`

3. **Prepare Your Image**
   
   **Option A: Build new image**
   ```bash
   # Build from Dockerfile
   sudo docker build -t myapp:latest .
   
   # Tag for registry
   sudo docker tag myapp:latest 10.9.8.121:5000/myapp:v1.0
   ```
   
   **Option B: Tag existing image**
   ```bash
   # Pull from public registry
   sudo docker pull nginx:alpine
   
   # Tag for private registry
   sudo docker tag nginx:alpine 10.9.8.121:5000/nginx:alpine
   ```

4. **Push to Private Registry**
   ```bash
   sudo docker push 10.9.8.121:5000/<image-name>:<tag>
   ```
   
   Example:
   ```bash
   sudo docker push 10.9.8.121:5000/myapp:v1.0
   ```

5. **Verify Push Success**
   ```bash
   # Check registry catalog
   curl -X GET http://admin:admin123@10.9.8.121:5000/v2/_catalog
   
   # Check specific image tags
   curl -X GET http://admin:admin123@10.9.8.121:5000/v2/<image-name>/tags/list
   ```

### 2. Deploying Images to Worker Nodes

#### Method 1: Docker Swarm Service (Recommended)

**Basic Service Deployment**
```bash
sudo docker service create \
  --name <service-name> \
  --secret registry-auth \
  --replicas 3 \
  --constraint 'node.role==worker' \
  10.9.8.121:5000/<image-name>:<tag>
```

**Advanced Service Deployment**
```bash
sudo docker service create \
  --name myapp-service \
  --secret registry-auth \
  --replicas 3 \
  --constraint 'node.role==worker' \
  --publish 8080:80 \
  --env REGISTRY_AUTH_FILE=/run/secrets/registry-auth \
  --restart-condition on-failure \
  --restart-max-attempts 3 \
  10.9.8.121:5000/myapp:v1.0
```

**Service Management Commands**
```bash
# List services
sudo docker service ls

# Check service status
sudo docker service ps <service-name>

# Scale service
sudo docker service scale <service-name>=5

# Update service
sudo docker service update --image 10.9.8.121:5000/myapp:v2.0 <service-name>

# Remove service
sudo docker service rm <service-name>
```

#### Method 2: Direct Node Deployment

1. **Connect to Worker Node**
   ```bash
   ssh m@10.9.8.122  # or 10.9.8.123
   ```

2. **Secure Login to Registry**
   ```bash
   sudo /etc/docker/creds/login-registry.sh
   ```

3. **Pull and Run Image**
   ```bash
   # Pull image
   sudo docker pull 10.9.8.121:5000/<image-name>:<tag>
   
   # Run container
   sudo docker run -d \
     --name <container-name> \
     --restart unless-stopped \
     -p 8080:80 \
     10.9.8.121:5000/<image-name>:<tag>
   ```

## Complete Example Workflow

### Deploying a Custom Web Application

```bash
# 1. Connect to manager node
ssh m@10.9.8.120

# 2. Create a simple web app (example)
mkdir -p /tmp/mywebapp
cd /tmp/mywebapp

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/
EXPOSE 80
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>My Web App</title></head>
<body>
    <h1>Hello from Docker Swarm!</h1>
    <p>This app is running from our private registry.</p>
</body>
</html>
EOF

# 3. Secure login to registry
sudo /etc/docker/creds/login-registry.sh

# 4. Build and tag image
sudo docker build -t mywebapp:latest .
sudo docker tag mywebapp:latest 10.9.8.121:5000/mywebapp:v1.0

# 5. Push to registry
sudo docker push 10.9.8.121:5000/mywebapp:v1.0

# 6. Deploy as service
sudo docker service create \
  --name mywebapp-service \
  --secret registry-auth \
  --replicas 3 \
  --constraint 'node.role==worker' \
  --publish 8080:80 \
  10.9.8.121:5000/mywebapp:v1.0

# 7. Verify deployment
sudo docker service ps mywebapp-service

# 8. Test the application
curl http://10.9.8.120:8080
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Authentication Failures
```bash
# Error: "unauthorized: authentication required"
# Solution: Use secure login script
sudo /etc/docker/creds/login-registry.sh
```

#### 2. Registry Connection Issues
```bash
# Error: "connection refused" or "no route to host"
# Solution: Verify registry is running
ssh m@10.9.8.121 "sudo docker ps | grep registry"

# Check registry service
ssh m@10.9.8.120 "sudo docker service ls | grep registry"
```

#### 3. Service Deployment Failures
```bash
# Check service logs
sudo docker service logs <service-name>

# Check node status
sudo docker node ls

# Verify registry secret exists
sudo docker secret ls | grep registry-auth
```

#### 4. Image Pull Failures on Workers
```bash
# SSH to failing worker node
ssh m@10.9.8.122

# Check Docker daemon configuration
sudo cat /etc/docker/daemon.json | grep insecure-registries

# Test registry connectivity
curl -X GET http://10.9.8.121:5000/v2/_catalog

# Verify secure login works
sudo /etc/docker/creds/login-registry.sh
sudo docker pull 10.9.8.121:5000/hello-world
```

### Registry Management

#### View Registry Contents
```bash
# List all repositories
curl -X GET http://admin:admin123@10.9.8.121:5000/v2/_catalog

# List tags for specific image
curl -X GET http://admin:admin123@10.9.8.121:5000/v2/<image-name>/tags/list

# Get image manifest
curl -X GET http://admin:admin123@10.9.8.121:5000/v2/<image-name>/manifests/<tag>
```

#### Registry Cleanup
```bash
# Run garbage collection (on registry host)
ssh m@10.9.8.121 "sudo docker exec registry bin/registry garbage-collect /etc/docker/registry/config.yml"

# Delete specific image (requires registry configuration changes)
# This is complex and should be done carefully
```

### Security Best Practices

1. **Credential Management**
   - Always use secure login scripts: `/etc/docker/creds/login-registry.sh`
   - Never use `docker login` with password on command line
   - Rotate credentials regularly using: `/etc/docker/creds/rotate-credentials.sh`

2. **Image Security**
   - Scan images for vulnerabilities before pushing
   - Use specific tags instead of `latest` for production
   - Keep base images updated

3. **Access Control**
   - Limit SSH access to cluster nodes
   - Use Docker Swarm secrets for service deployments
   - Monitor registry access logs

## Useful Commands Reference

### Registry Operations
```bash
# Secure login
sudo /etc/docker/creds/login-registry.sh

# Secure logout
sudo /etc/docker/creds/logout-registry.sh

# List local images
sudo docker images

# Remove local image
sudo docker rmi <image-name>:<tag>

# View registry catalog
curl -X GET http://admin:admin123@10.9.8.121:5000/v2/_catalog
```

### Service Operations
```bash
# Create service
sudo docker service create --name <name> <image>

# List services
sudo docker service ls

# Service details
sudo docker service inspect <service-name>

# Service logs
sudo docker service logs <service-name>

# Scale service
sudo docker service scale <service-name>=<replicas>

# Update service
sudo docker service update <service-name>

# Remove service
sudo docker service rm <service-name>
```

### Container Operations
```bash
# List containers on current node
sudo docker ps

# Container logs
sudo docker logs <container-name>

# Execute command in container
sudo docker exec -it <container-name> /bin/sh

# Stop container
sudo docker stop <container-name>

# Remove container
sudo docker rm <container-name>
```

## Support and Maintenance

### Credential Rotation
```bash
# Rotate registry password
sudo /etc/docker/creds/rotate-credentials.sh <new-password>

# Update all nodes after rotation
dspm deploy --skip-terraform --ansible-tags docker_credentials
```

### Registry Backup
```bash
# Backup registry data (on registry host)
ssh m@10.9.8.121 "sudo tar -czf registry-backup-$(date +%Y%m%d).tar.gz /var/lib/registry"
```

### Monitoring
```bash
# Check cluster status
sudo docker node ls

# Check service health
sudo docker service ls

# View system resources
sudo docker system df

# Clean up unused resources
sudo docker system prune -f
```

---

**Document Version**: 1.0  
**Last Updated**: June 13, 2025  
**Maintained By**: Docker Swarm Proxmox Manager (DSPM) Project