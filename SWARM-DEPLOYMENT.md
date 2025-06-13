# Docker Swarm Deployment Guide

This guide explains how to deploy the Sourdough documentation to your Docker Swarm cluster.

## Swarm Architecture

- **Manager Node**: 10.9.8.120
- **Worker Nodes**: 
  - Worker 1: 10.9.8.121 (also hosts the Docker registry)
  - Worker 2: 10.9.8.122 (target for deployment)
  - Worker 3: 10.9.8.123

## Deployment Methods

### Method 1: Automatic via GitHub Actions
The GitHub Actions workflow will attempt to deploy automatically if:
1. The runner is a Swarm manager node, OR
2. The runner has SSH access to the Swarm manager (10.9.8.120)

### Method 2: Manual Remote Deployment
Run from any machine with SSH access to the Swarm manager:
```bash
./scripts/deploy-to-swarm-remote.sh
```

### Method 3: Direct Deployment on Swarm Manager
SSH to the Swarm manager and run:
```bash
# Pull the latest image
docker pull 10.9.8.121:5000/sourdough-docs:latest

# Deploy the stack
docker stack deploy -c docker-compose.swarm.yml sourdough
```

## Targeting Specific Worker Nodes

To deploy specifically to worker-2 (10.9.8.122), you have several options:

### Option 1: Label the Nodes
On the Swarm manager (10.9.8.120):
```bash
# List nodes to get IDs
docker node ls

# Label the worker nodes
docker node update --label-add name=worker-2 <NODE_ID_FOR_10.9.8.122>
```

Then update `docker-compose.swarm.yml`:
```yaml
placement:
  constraints:
    - node.labels.name == worker-2
```

### Option 2: Use Hostname (if it matches IP)
```yaml
placement:
  constraints:
    - node.hostname == 10.9.8.122
```

### Option 3: Use Node ID
```yaml
placement:
  constraints:
    - node.id == <NODE_ID>
```

## Service Management

### Check Service Status
```bash
docker service ls
docker service ps sourdough_sourdough-docs
```

### View Logs
```bash
docker service logs sourdough_sourdough-docs
```

### Update Service
```bash
docker service update --image 10.9.8.121:5000/sourdough-docs:latest sourdough_sourdough-docs
```

### Scale Service
```bash
docker service scale sourdough_sourdough-docs=2
```

### Remove Service
```bash
docker stack rm sourdough
```

## Access the Documentation

Once deployed, access the documentation at:
- http://10.9.8.122:8080 (if deployed to worker-2)
- http://<worker-ip>:8080 (depending on which worker it's deployed to)

## Troubleshooting

### Service Not Starting
1. Check if the image can be pulled:
   ```bash
   docker pull 10.9.8.121:5000/sourdough-docs:latest
   ```

2. Check service logs:
   ```bash
   docker service logs sourdough_sourdough-docs
   ```

3. Check node availability:
   ```bash
   docker node ls
   ```

### SSH Access Issues
For automatic deployment, ensure the GitHub runner has SSH key access to 10.9.8.120:
```bash
ssh-copy-id 10.9.8.120
```

### Port Conflicts
If port 8080 is already in use, update the port mapping in `docker-compose.swarm.yml`:
```yaml
ports:
  - "8081:80"  # Change 8080 to another port
```