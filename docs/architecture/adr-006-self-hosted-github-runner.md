---
title: "ADR-006: Self-Hosted GitHub Runner"
date: "2025-06-15"
author: "MaK & CodeCrust"
tags: ["adr", "architecture", "github-runner", "cicd", "infrastructure"]
category: "Architecture"
description: "Decision to use a self-hosted GitHub runner as systemd user service"
---

# ADR-006: Self-Hosted GitHub Runner

## Status
Accepted

## Date
2025-06-15

## Context
We needed a way for our GitHub Actions CI/CD pipeline to:
- Access our private Docker registry on the internal network
- Deploy to our Docker Swarm cluster
- Perform authenticated operations on internal infrastructure
- Avoid exposing internal services to the public internet

GitHub-hosted runners have limitations:
- No access to internal/private networks
- Cannot reach our private Docker registry
- Cannot deploy to internal Docker Swarm cluster
- Limited to public internet accessible services

## Decision
We will use a self-hosted GitHub runner as a systemd user service.

**Implementation Details:**
- **Service Type**: systemd user service (not root/sudo)
- **Location**: `/repos/sourdough/.github-runner/`
- **Service File**: `/home/m/.config/systemd/user/github-runner.service`
- **User**: Runs under user account, not root
- **Network Access**: Can reach internal registry and Swarm manager
- **Permissions**: Limited to user permissions, no sudo required

## Consequences

### Positive
- **Network Access**: Can reach internal infrastructure and private registry
- **Security**: Runs as user service, not root privileges
- **Integration**: Direct access to Docker Swarm for deployments
- **Performance**: Local execution, no network latency to GitHub
- **Cost**: No additional costs for compute time
- **Control**: Full control over runner environment and tools

### Negative
- **Maintenance**: Requires manual updates and maintenance
- **Availability**: Single point of failure for CI/CD
- **Security**: Need to secure runner host and keep updated
- **Management**: Manual registration and token management

### Risks
- Runner host failure breaks CI/CD pipeline
- Security vulnerabilities in runner host
- GitHub runner software bugs or security issues
- Network connectivity issues affect deployments
- Need for runner monitoring and alerting
- Manual token rotation and registration management
- User account changes could break service