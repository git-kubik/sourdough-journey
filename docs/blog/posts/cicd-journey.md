---
title: "Setting Up CI/CD for Sourdough Documentation"
date: "2025-06-15"
author: "CodeCrust"
tags: ["cicd", "docker", "github-actions", "deployment", "infrastructure", "devops"]
category: "Infrastructure"
description: "Complete journey of setting up Docker registry, GitHub Actions, and automated deployments"
---

# Setting Up CI/CD for Sourdough Documentation

## The Journey Begins

What started as a simple documentation site for MaK's sourdough baking journey evolved into a full-fledged DevOps adventure. This post chronicles the technical challenges and solutions we encountered while setting up a complete CI/CD pipeline for automated documentation deployment.

## The Infrastructure

Our deployment target was a Docker Swarm cluster with the following architecture:

- **Swarm Manager**: Centralized control node
- **Worker Nodes**: Multiple nodes for distributed deployment
- **Private Docker Registry**: Self-hosted registry for container images
- **Documentation Site**: Publicly accessible documentation

## Chapter 1: The Registry Migration

Our first challenge came when we discovered the registry had moved to a different host. This seemingly simple change cascaded into multiple issues:

### The Problems

1. **Hardcoded Registry URLs**: The old registry was hardcoded throughout our configuration files
2. **Failed Deployments**: Services couldn't pull images from the non-existent old registry
3. **Authentication Issues**: Workers couldn't authenticate with the new registry
4. **Rollback Loops**: Services kept trying to rollback to images that didn't exist

### The Solutions

We systematically updated all references:

```yaml
# docker-compose.swarm.yml
services:
  sourdough-docs:
    image: registry.example.com/sourdough-docs:latest  # Updated registry URL
```

But the real insight came when we realized Docker Swarm workers need proper authentication forwarding.

## Chapter 2: Understanding Swarm Authentication

The key breakthrough was understanding how Docker Swarm handles registry authentication:

1. **Manager Authentication**: The swarm manager must login to the registry
2. **Credential Forwarding**: Use `--with-registry-auth` flag during service updates
3. **Worker Configuration**: Each worker needs the registry in its `insecure-registries` list

```bash
# On the swarm manager
echo "$REGISTRY_PASSWORD" | docker login $REGISTRY_URL -u $REGISTRY_USERNAME --password-stdin

# Update service with authentication
docker service update --with-registry-auth --image $REGISTRY_URL/sourdough-docs:latest sourdough_sourdough-docs
```

## Chapter 3: Creating the Test Framework

To ensure our setup was bulletproof, we created comprehensive testing tools:

### 1. Docker Registry Test Guide

A detailed guide (`DOCKER_REGISTRY_TEST_GUIDE.md`) documenting:

- Step-by-step testing procedures
- Common troubleshooting scenarios
- Performance benchmarking approaches

### 2. Automated Test Script

An intelligent script (`automated-registry-test.sh`) that:

- Builds a test container
- Authenticates with the registry
- Performs the complete push/pull cycle
- Validates the deployment

```bash
# Using environment variables for security
REGISTRY_USERNAME=myuser REGISTRY_PASSWORD=mypass ./automated-registry-test.sh
```

## Chapter 4: Securing the Pipeline

Security was paramount. We eliminated hardcoded credentials by:

1. **GitHub Secrets**: Configured `REGISTRY_USERNAME` and `REGISTRY_PASSWORD`
2. **Environment Variables**: Used in local testing scripts
3. **Warning Messages**: Added alerts when default credentials are used

```yaml
# .github/workflows/build-and-deploy.yml
env:
  REGISTRY_USERNAME: ${{ secrets.REGISTRY_USERNAME }}
  REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
```

## Chapter 5: The GitHub Runner as a Service

The final piece was setting up the GitHub Actions runner as a persistent service:

### Creating a User Service

Instead of running the runner manually or as root, we created a systemd user service:

```ini
# ~/.config/systemd/user/github-runner.service
[Unit]
Description=GitHub Actions Runner
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/runner
ExecStart=/path/to/runner/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
```

This ensures the runner:

- Starts automatically on boot
- Runs with user permissions (not root)
- Restarts if it crashes
- Logs to the systemd journal

## Chapter 6: The Complete Pipeline

Our final CI/CD pipeline accomplishes:

1. **Trigger**: Push to main branch
2. **Build**: Multi-stage Docker build (Python + nginx)
3. **Test**: Container health verification
4. **Push**: Authenticated push to private registry
5. **Deploy**: Automated swarm service update

The entire process takes about 2 minutes from commit to live deployment!

## Lessons Learned

### 1. **Always Use Environment Variables**
Hardcoded credentials in repositories are a security risk and maintenance nightmare.

### 2. **Test Everything**
Our automated test script caught issues that manual testing missed.

### 3. **Document as You Go**
The comprehensive guides we created saved hours of debugging later.

### 4. **Understand Your Tools**
Docker Swarm's authentication model wasn't obvious until we dug deep.

### 5. **User Services > Root Services**
Running services as a regular user is more secure and easier to manage.

## Technical Stack Summary

- **Container Platform**: Docker Swarm
- **Registry**: Docker Distribution v2
- **CI/CD**: GitHub Actions (self-hosted runner)
- **Documentation**: MkDocs with Material theme
- **Web Server**: nginx (in container)
- **Monitoring**: systemd journal

## What's Next?

With our robust CI/CD pipeline in place, we can now focus on:

- Adding more interactive tools to the documentation
- Implementing automated testing for recipe calculations
- Setting up monitoring and alerting
- Creating backup and disaster recovery procedures

## Conclusion

What began as a simple registry URL update evolved into a complete overhaul of our deployment infrastructure. The journey taught us valuable lessons about Docker Swarm, registry authentication, and the importance of automation.

Just like perfecting a sourdough recipe, building a reliable CI/CD pipeline requires patience, iteration, and attention to detail. But once established, it provides consistent, reproducible results every time.

---

*"In both baking and DevOps, the difference between good and great lies in understanding not just the 'what' but the 'why' behind each step."* — CodeCrust

## References

- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [GitHub Actions Self-Hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [MkDocs Material Theme](https://squidfunk.github.io/mkdocs-material/)

---

**Tags**: #Docker #CI/CD #GitHubActions #Infrastructure #DevOps