#!/bin/bash

# Deploy sourdough-docs to Docker Swarm via remote manager

SWARM_MANAGER="10.9.8.120"
STACK_NAME="sourdough"
REGISTRY="10.9.8.121:5000"
IMAGE_NAME="sourdough-docs"
SERVICE_NAME="${STACK_NAME}_sourdough-docs"

echo "🚀 Deploying Sourdough Documentation to Docker Swarm..."
echo "Swarm Manager: ${SWARM_MANAGER}"
echo "Target node: swarm-worker-2"
echo ""

# Check if SSH is available to the swarm manager
echo "📡 Checking connection to Swarm manager..."
if ! ssh -o ConnectTimeout=5 ${SWARM_MANAGER} "echo 'Connected'" >/dev/null 2>&1; then
    echo "❌ Error: Cannot connect to Swarm manager at ${SWARM_MANAGER}"
    echo "Please ensure:"
    echo "  1. SSH is configured for passwordless access to ${SWARM_MANAGER}"
    echo "  2. The Swarm manager is accessible"
    echo ""
    echo "To set up SSH key access:"
    echo "  ssh-copy-id ${SWARM_MANAGER}"
    exit 1
fi

# Copy the docker-compose file to the swarm manager
echo "📋 Copying deployment configuration to Swarm manager..."
scp docker-compose.swarm.yml ${SWARM_MANAGER}:/tmp/docker-compose.swarm.yml

# Deploy via SSH to the swarm manager
echo "🔄 Deploying stack on Swarm manager..."
ssh ${SWARM_MANAGER} << 'EOF'
    # Pull the latest image
    echo "📦 Pulling latest image from registry..."
    sudo docker pull 10.9.8.121:5000/sourdough-docs:latest
    
    # Deploy the stack
    echo "🚀 Deploying stack..."
    sudo docker stack deploy -c /tmp/docker-compose.swarm.yml sourdough
    
    # Wait for service to be ready
    sleep 10
    
    # Check service status
    echo ""
    echo "📊 Service status:"
    sudo docker service ls | grep sourdough
    echo ""
    sudo docker service ps sourdough_sourdough-docs
    
    # Clean up temp file
    rm /tmp/docker-compose.swarm.yml
EOF

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access the documentation at:"
echo "   http://10.9.8.122:8081 (or the actual IP of swarm-worker-2)"
echo ""
echo "📝 To manage the service, SSH to the Swarm manager:"
echo "   ssh ${SWARM_MANAGER}"
echo "   sudo docker service logs ${SERVICE_NAME}"
echo "   sudo docker service ps ${SERVICE_NAME}"