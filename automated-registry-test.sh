#!/bin/bash
# automated-registry-test.sh - Documentation Container Registry Test

set -e

REGISTRY="10.9.8.122:5000"
IMAGE_NAME="sourdough-docs"
USERNAME="${REGISTRY_USERNAME:-admin}"
PASSWORD="${REGISTRY_PASSWORD:-admin123}"

echo "Starting automated documentation container registry test..."

# Check if credentials are provided via environment variables
if [ -z "$REGISTRY_USERNAME" ] || [ -z "$REGISTRY_PASSWORD" ]; then
    echo "⚠️  Using default credentials. Set REGISTRY_USERNAME and REGISTRY_PASSWORD env vars for production use."
fi

# Step 1: Build documentation container
echo "Building documentation container..."
echo "This will build the full MkDocs documentation site with nginx server..."

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

# Step 5: Test documentation container
echo "Testing pulled documentation container..."
echo "Starting container in background to test web server..."
CONTAINER_ID=$(docker run -d -p 8080:80 ${REGISTRY}/${IMAGE_NAME}:latest)

# Wait for container to start
sleep 3

# Test if documentation site is accessible
echo "Testing documentation site accessibility..."
if curl -s http://localhost:8080/ | grep -q "html"; then
    echo "✅ Documentation site is accessible!"
else
    echo "❌ Documentation site test failed"
    docker logs $CONTAINER_ID
    exit 1
fi

# Stop and remove test container
docker stop $CONTAINER_ID > /dev/null
docker rm $CONTAINER_ID > /dev/null

echo "✅ Automated documentation container registry test completed successfully!"

# Cleanup
docker rmi ${REGISTRY}/${IMAGE_NAME}:latest