#!/bin/bash
# Script to build and push Docker image to private registry

REGISTRY="10.9.8.121:5000"
IMAGE_NAME="sourdough-docs"
VERSION=$(git rev-parse --short HEAD)-$(date +%Y%m%d%H%M%S)

# Configure Docker to allow insecure registry
echo "Configuring Docker for insecure registry..."
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Please ensure /etc/docker/daemon.json contains:"
    echo '{'
    echo '  "insecure-registries": ["10.9.8.121:5000"]'
    echo '}'
    echo "Then restart Docker daemon: sudo systemctl restart docker"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Please add 10.9.8.121:5000 to insecure registries in Docker Desktop settings"
fi

echo ""
read -p "Have you configured the insecure registry? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please configure the insecure registry first"
    exit 1
fi

# Build the image
echo "Building Docker image..."
docker build -t ${REGISTRY}/${IMAGE_NAME}:${VERSION} -t ${REGISTRY}/${IMAGE_NAME}:latest .

if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
fi

# Push to registry
echo "Pushing to registry ${REGISTRY}..."
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
docker push ${REGISTRY}/${IMAGE_NAME}:latest

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed Docker image!"
    echo "Registry: ${REGISTRY}"
    echo "Image: ${IMAGE_NAME}"
    echo "Version: ${VERSION}"
    echo ""
    echo "Pull command:"
    echo "docker pull ${REGISTRY}/${IMAGE_NAME}:latest"
else
    echo "❌ Failed to push to registry"
    exit 1
fi