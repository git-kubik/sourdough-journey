---
title: "ADR-005: Private Docker Registry"
date: "2025-06-15"
author: "MaK & CodeCrust"
tags: ["adr", "architecture", "docker-registry", "storage", "security"]
category: "Architecture"
description: "Decision to use a private Docker registry for image storage and distribution"
---

# ADR-005: Private Docker Registry

## Status
Accepted

## Date
2025-06-15

## Context
We needed a Docker registry solution that could:

- Store our built Docker images securely
- Be accessible from our CI/CD pipeline and deployment infrastructure
- Provide reasonable performance for image pulls
- Be cost-effective for our use case
- Integrate with our existing Docker Swarm infrastructure

Alternative registry options considered:

- **Docker Hub**: Public visibility, rate limiting, costs for private repos
- **GitHub Container Registry**: Tied to GitHub, potential costs
- **AWS ECR**: AWS dependency, additional complexity and costs
- **Azure Container Registry**: Microsoft ecosystem, additional costs
- **Self-hosted Registry**: Infrastructure management overhead

## Decision
We will use a private Docker registry hosted at `10.9.8.122:5000`.

**Implementation Details:**
- **Location**: Internal network at `10.9.8.122:5000`
- **Authentication**: Username/password authentication
- **Access**: Accessible from CI/CD pipeline and Swarm nodes
- **Security**: Internal network, not publicly accessible
- **Credentials**: Stored in GitHub Secrets for CI/CD access

## Consequences

### Positive
- **Cost**: No external registry costs
- **Performance**: Fast image pulls from internal network
- **Control**: Full control over registry configuration and policies
- **Security**: Not publicly accessible, internal network only
- **Integration**: Direct access from Swarm nodes and CI/CD
- **Reliability**: Internal network availability

### Negative
- **Maintenance**: Registry maintenance and updates required
- **Backup**: Need to implement backup strategy for images
- **Scaling**: Limited by single registry instance
- **Security**: Responsible for registry security and updates

### Risks
- Single point of failure for image storage
- Registry host hardware failure affects deployments
- Security vulnerabilities in registry software
- Network connectivity issues affect image operations
- Need for backup and disaster recovery planning
- Credential management complexity