#!/bin/bash

# Deploy sourdough-docs to Docker Swarm on swarm-worker-2

STACK_NAME="sourdough"
REGISTRY="10.9.8.121:5000"
IMAGE_NAME="sourdough-docs"
SERVICE_NAME="${STACK_NAME}_sourdough-docs"

echo "🚀 Deploying Sourdough Documentation to Docker Swarm..."
echo "Target node: swarm-worker-2"
echo ""

# Check if we're on a Swarm manager node
if ! docker node ls >/dev/null 2>&1; then
    echo "❌ Error: This script must be run from a Docker Swarm manager node"
    echo "Please run: docker swarm init (if not in a swarm) or run from a manager node"
    exit 1
fi

# Check if swarm-worker-2 exists
if ! docker node ls | grep -q "swarm-worker-2"; then
    echo "❌ Error: Node 'swarm-worker-2' not found in the swarm"
    echo "Available nodes:"
    docker node ls
    exit 1
fi

# Pull the latest image
echo "📦 Pulling latest image from registry..."
docker pull ${REGISTRY}/${IMAGE_NAME}:latest

# Deploy or update the stack
echo "🔄 Deploying stack..."
docker stack deploy -c docker-compose.swarm.yml ${STACK_NAME}

# Wait for service to be ready
echo "⏳ Waiting for service to be ready..."
sleep 5

# Check service status
echo ""
echo "📊 Service status:"
docker service ls | grep ${SERVICE_NAME}
echo ""
docker service ps ${SERVICE_NAME}

# Get the node where the service is running
echo ""
echo "📍 Service is constrained to run on: swarm-worker-2"
echo ""

# Show how to access the service
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access the documentation at:"
echo "   http://swarm-worker-2:8080"
echo "   or"
echo "   http://<swarm-worker-2-ip>:8080"
echo ""
echo "📝 Useful commands:"
echo "   - Check logs: docker service logs ${SERVICE_NAME}"
echo "   - Scale service: docker service scale ${SERVICE_NAME}=2"
echo "   - Update service: docker service update --image ${REGISTRY}/${IMAGE_NAME}:latest ${SERVICE_NAME}"
echo "   - Remove stack: docker stack rm ${STACK_NAME}"