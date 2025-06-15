# Docker Registry Test Pattern Guide

This guide provides step-by-step instructions for testing the Docker Registry workflow on the Docker Swarm Proxmox platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Registry Access Information](#registry-access-information)
- [Step-by-Step Test Procedure](#step-by-step-test-procedure)
- [Verification Commands](#verification-commands)
- [Troubleshooting](#troubleshooting)
- [Alternative Test Images](#alternative-test-images)
- [Security Notes](#security-notes)
- [Success Criteria](#success-criteria)

## Prerequisites

1. **Docker Swarm Cluster**: Fully deployed and operational
2. **Registry Service**: Running on swarm-worker-2 (10.9.8.122:5000)
3. **Local Docker Client**: Installed and configured

## Registry Access Information

| Component | Value |
|-----------|-------|
| **Registry URL** | `10.9.8.122:5000` |
| **Admin Username** | `admin` |
| **Admin Password** | `admin123` |
| **Deploy Username** | `deploy` |
| **Deploy Password** | `deploy123` |

## Step-by-Step Test Procedure

### Step 1: Configure Docker Client for Insecure Registry

Since the registry uses HTTP (not HTTPS), configure Docker to allow insecure connections:

```bash
# Edit Docker daemon configuration
sudo nano /etc/docker/daemon.json

# Add the following content:
{
  "insecure-registries": ["10.9.8.122:5000"]
}

# Reload Docker daemon
sudo systemctl reload docker
```

### Step 2: Create a Test Application

Create a simple test Docker image:

```bash
# Create a test directory
mkdir test-app && cd test-app

# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM alpine:latest

# Install basic tools
RUN apk add --no-cache curl

# Create a simple test script
RUN echo '#!/bin/sh' > /test.sh && \
    echo 'echo "Hello from Docker Registry Test!"' >> /test.sh && \
    echo 'echo "Image: $IMAGE_NAME"' >> /test.sh && \
    echo 'echo "Registry: $REGISTRY_URL"' >> /test.sh && \
    echo 'date' >> /test.sh && \
    chmod +x /test.sh

# Set environment variables
ENV IMAGE_NAME="test-app" \
    REGISTRY_URL="10.9.8.122:5000"

CMD ["/test.sh"]
EOF

# Build the image
docker build -t test-app:latest .
```

### Step 3: Test Image Locally

Verify the image works before pushing:

```bash
docker run --rm test-app:latest
```

**Expected Output:**
```
Hello from Docker Registry Test!
Image: test-app
Registry: 10.9.8.122:5000
[Current date/time]
```

### Step 4: Login to Registry

Authenticate with the Docker registry:

```bash
# Login using secure method
echo "admin123" | docker login 10.9.8.122:5000 -u admin --password-stdin
```

**Expected Output:**
```
Login Succeeded
WARNING! Your credentials are stored unencrypted in '/home/[user]/.docker/config.json'.
```

### Step 5: Tag and Push Image

Tag the image for the registry and push it:

```bash
# Tag the image
docker tag test-app:latest 10.9.8.122:5000/test-app:latest

# Push to registry
docker push 10.9.8.122:5000/test-app:latest
```

**Expected Output:**
```
The push refers to repository [10.9.8.122:5000/test-app]
[layer hashes]: Pushed
latest: digest: sha256:[hash] size: [size]
```

### Step 6: Verify Image in Registry

Check that the image is stored in the registry:

```bash
# List all repositories in registry
curl -u admin:admin123 http://10.9.8.122:5000/v2/_catalog

# List tags for specific repository
curl -u admin:admin123 http://10.9.8.122:5000/v2/test-app/tags/list
```

**Expected Output:**
```json
{"repositories":["test-app"]}
{"name":"test-app","tags":["latest"]}
```

### Step 7: Remove Local Images

Clean up local images to test the pull:

```bash
# Remove local images
docker rmi test-app:latest 10.9.8.122:5000/test-app:latest

# Verify removal
docker images | grep test-app
# Should return no results
```

### Step 8: Pull and Test from Registry

Pull the image from the registry and test it:

```bash
# Pull from registry
docker pull 10.9.8.122:5000/test-app:latest

# Test the pulled image
docker run --rm 10.9.8.122:5000/test-app:latest
```

**Expected Output:**
```
latest: Pulling from test-app
[download progress]
Status: Downloaded newer image for 10.9.8.122:5000/test-app:latest

Hello from Docker Registry Test!
Image: test-app
Registry: 10.9.8.122:5000
[Current date/time]
```

## Verification Commands

### Registry Health Check
```bash
# Basic connectivity (should return 401 - authentication required)
curl http://10.9.8.122:5000/v2/

# Authenticated health check (should return {})
curl -u admin:admin123 http://10.9.8.122:5000/v2/
```

### Registry Service Status
```bash
# Check service status in swarm
ssh m@10.9.8.120 'sudo docker service ls | grep registry'
ssh m@10.9.8.120 'sudo docker service ps registry_registry'
```

### View Registry Logs
```bash
# Check registry logs
ssh m@10.9.8.120 'sudo docker service logs registry_registry --tail 20'
```

## Troubleshooting

### Common Issues and Solutions

1. **"http: server gave HTTP response to HTTPS client"**
   - **Cause**: Docker daemon not configured for insecure registry
   - **Solution**: Add registry to `insecure-registries` in `/etc/docker/daemon.json`

2. **"authentication required"**
   - **Cause**: Not logged in or credentials expired
   - **Solution**: Re-run `docker login` command

3. **"connection refused"**
   - **Cause**: Registry service not running
   - **Solution**: Check service status and redeploy if needed

4. **"no such host"**
   - **Cause**: Incorrect IP address
   - **Solution**: Verify registry is on 10.9.8.122:5000

### Registry Management Commands

```bash
# Deploy/redeploy registry
dspm registry --action deploy

# Check registry status
dspm registry --action status

# View registry information
dspm registry --action info

# Manage users
dspm registry --action users --username [username]
```

### Debug Commands

```bash
# Check Docker daemon configuration
sudo cat /etc/docker/daemon.json

# Test registry connectivity
telnet 10.9.8.122 5000

# Check local Docker images
docker images

# Check Docker login status
cat ~/.docker/config.json
```

## Alternative Test Images

For different test scenarios, you can create variations:

### Nginx Web Server Test
```dockerfile
FROM nginx:alpine
RUN echo '<h1>Hello from Registry!</h1>' > /usr/share/nginx/html/index.html
EXPOSE 80
```

**Test commands:**
```bash
docker build -t nginx-test .
docker tag nginx-test:latest 10.9.8.122:5000/nginx-test:latest
docker push 10.9.8.122:5000/nginx-test:latest
docker run -d -p 8080:80 10.9.8.122:5000/nginx-test:latest
curl http://localhost:8080
```

### Python Application Test
```dockerfile
FROM python:3.9-alpine
RUN echo 'print("Python app from registry!")' > app.py
CMD ["python", "app.py"]
```

**Test commands:**
```bash
docker build -t python-test .
docker tag python-test:latest 10.9.8.122:5000/python-test:latest
docker push 10.9.8.122:5000/python-test:latest
docker run --rm 10.9.8.122:5000/python-test:latest
```

### Multi-stage Build Test
```dockerfile
FROM golang:alpine AS builder
WORKDIR /app
RUN echo 'package main\nimport "fmt"\nfunc main() { fmt.Println("Go app from registry!") }' > main.go
RUN go build -o app main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/app .
CMD ["./app"]
```

## Advanced Test Scenarios

### Load Testing
```bash
# Push multiple images
for i in {1..10}; do
  docker tag test-app:latest 10.9.8.122:5000/test-app:v$i
  docker push 10.9.8.122:5000/test-app:v$i
done

# Verify all images
curl -u admin:admin123 http://10.9.8.122:5000/v2/test-app/tags/list
```

### Concurrent Operations
```bash
# Test concurrent pushes (run in separate terminals)
docker tag test-app:latest 10.9.8.122:5000/test-app:concurrent1 &
docker tag test-app:latest 10.9.8.122:5000/test-app:concurrent2 &
docker push 10.9.8.122:5000/test-app:concurrent1 &
docker push 10.9.8.122:5000/test-app:concurrent2 &
wait
```

### Large Image Test
```dockerfile
FROM ubuntu:latest
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    git \
    vim \
    && rm -rf /var/lib/apt/lists/*
CMD ["echo", "Large image test completed"]
```

## Automated Test Script

Create an automated test script:

```bash
#!/bin/bash
# automated-registry-test.sh

set -e

REGISTRY="10.9.8.122:5000"
IMAGE_NAME="automated-test"
USERNAME="admin"
PASSWORD="admin123"

echo "Starting automated registry test..."

# Step 1: Build test image
echo "Building test image..."
cat > Dockerfile << EOF
FROM alpine:latest
RUN echo 'echo "Automated test successful!"' > /test.sh && chmod +x /test.sh
CMD ["/test.sh"]
EOF

docker build -t ${IMAGE_NAME}:latest .

# Step 2: Login
echo "Logging into registry..."
echo "${PASSWORD}" | docker login ${REGISTRY} -u ${USERNAME} --password-stdin

# Step 3: Push
echo "Pushing image..."
docker tag ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
docker push ${REGISTRY}/${IMAGE_NAME}:latest

# Step 4: Clean and pull
echo "Cleaning local images and pulling from registry..."
docker rmi ${IMAGE_NAME}:latest ${REGISTRY}/${IMAGE_NAME}:latest
docker pull ${REGISTRY}/${IMAGE_NAME}:latest

# Step 5: Test
echo "Testing pulled image..."
docker run --rm ${REGISTRY}/${IMAGE_NAME}:latest

echo "✅ Automated registry test completed successfully!"

# Cleanup
docker rmi ${REGISTRY}/${IMAGE_NAME}:latest
rm Dockerfile
```

Make it executable and run:
```bash
chmod +x automated-registry-test.sh
./automated-registry-test.sh
```

## Performance Benchmarking

### Image Push/Pull Performance
```bash
#!/bin/bash
# benchmark-registry.sh

REGISTRY="10.9.8.122:5000"
IMAGE_SIZES=("small" "medium" "large")

for size in "${IMAGE_SIZES[@]}"; do
    echo "Testing $size image performance..."
    
    start_time=$(date +%s)
    docker push ${REGISTRY}/test-${size}:latest
    push_time=$(($(date +%s) - start_time))
    
    docker rmi ${REGISTRY}/test-${size}:latest
    
    start_time=$(date +%s)
    docker pull ${REGISTRY}/test-${size}:latest
    pull_time=$(($(date +%s) - start_time))
    
    echo "$size image - Push: ${push_time}s, Pull: ${pull_time}s"
done
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Passwords**: The default passwords (admin123, deploy123) should be changed in production
2. **Use HTTPS**: Configure TLS/SSL for production deployments
3. **Network Security**: Restrict registry access to authorized networks
4. **Credential Storage**: Use Docker credential helpers in production
5. **Registry Scanning**: Implement vulnerability scanning for stored images
6. **Access Control**: Use fine-grained access control policies

### Production Security Checklist

- [ ] Changed default passwords
- [ ] Configured HTTPS/TLS
- [ ] Set up proper firewall rules
- [ ] Configured Docker credential helper
- [ ] Implemented image scanning
- [ ] Set up audit logging
- [ ] Configured backup strategy
- [ ] Implemented access monitoring

## Success Criteria

A successful test should demonstrate:

✅ **Image Lifecycle**: Build → Tag → Push → Remove → Pull → Run  
✅ **Authentication**: Successful login with provided credentials  
✅ **Registry API**: Catalog and tag listing functionality  
✅ **Data Integrity**: Identical behavior before and after registry round-trip  
✅ **Network Connectivity**: Proper communication between client and registry  
✅ **Service Health**: Registry service running and responding correctly  

## Integration with CI/CD

Example GitLab CI configuration:

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  REGISTRY: "10.9.8.122:5000"
  IMAGE_NAME: "$CI_PROJECT_NAME"

build:
  stage: build
  script:
    - docker build -t $IMAGE_NAME:$CI_COMMIT_SHA .
    - docker tag $IMAGE_NAME:$CI_COMMIT_SHA $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA
    - echo "$REGISTRY_PASSWORD" | docker login $REGISTRY -u "$REGISTRY_USERNAME" --password-stdin
    - docker push $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA

deploy:
  stage: deploy
  script:
    - docker service update --image $REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA my-service
  only:
    - main
```

This workflow confirms the registry is fully functional for Docker image storage and distribution in your swarm cluster and provides a comprehensive testing framework for ongoing validation.

---

**Document Version**: 1.0  
**Last Updated**: June 15, 2025  
**Platform**: Docker Swarm Proxmox Manager (DSPM)  
**Registry Version**: Docker Distribution 2.x