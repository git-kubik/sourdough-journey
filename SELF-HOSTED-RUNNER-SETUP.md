# Self-Hosted GitHub Actions Runner Setup

This guide explains how to set up a self-hosted runner for the GitHub Actions workflow.

## Prerequisites

On the machine that will run the self-hosted runner:

1. **Docker** must be installed and running
2. **Docker insecure registry** must be configured for `10.9.8.121:5000`
3. **Network access** to the Docker registry at `10.9.8.121:5000`
4. **curl** command available for health checks

## Setup Steps

### 1. Configure Docker for Insecure Registry

Add to `/etc/docker/daemon.json`:
```json
{
  "insecure-registries": ["10.9.8.121:5000"]
}
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### 2. Add Self-Hosted Runner to Repository

1. Go to your GitHub repository: https://github.com/git-kubik/sourdough-journey
2. Navigate to Settings → Actions → Runners
3. Click "New self-hosted runner"
4. Follow the instructions to download and configure the runner

Example setup commands (adjust for your OS):
```bash
# Create a folder for the runner
mkdir actions-runner && cd actions-runner

# Download the latest runner package
curl -o actions-runner-linux-x64-2.319.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.319.1/actions-runner-linux-x64-2.319.1.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.319.1.tar.gz

# Configure the runner
./config.sh --url https://github.com/git-kubik/sourdough-journey --token YOUR_TOKEN

# Install and start as a service (optional)
sudo ./svc.sh install
sudo ./svc.sh start
```

### 3. Verify Setup

Once the runner is online, push to the repository to trigger the workflow:
```bash
git push origin main
```

Check the Actions tab in GitHub to monitor the build.

## Troubleshooting

### Docker Registry Connection Issues
```bash
# Test registry connectivity
docker pull 10.9.8.121:5000/sourdough-docs:latest

# If it fails, check:
# 1. Docker daemon has insecure-registries configured
# 2. Network connectivity to 10.9.8.121:5000
# 3. Firewall rules allow port 5000
```

### Runner Not Picking Up Jobs
- Ensure runner is showing as "Idle" in GitHub Settings
- Check runner logs: `journalctl -u actions.runner.git-kubik-sourdough-journey.HOSTNAME.service -f`
- Verify the workflow uses `runs-on: self-hosted`

## Security Notes

- The self-hosted runner has access to your local network and Docker daemon
- Only use self-hosted runners on trusted infrastructure
- Consider using runner groups for better access control