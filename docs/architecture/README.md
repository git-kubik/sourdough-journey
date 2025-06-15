---
title: "Architecture Decision Records (ADRs)"
date: "2025-06-15"
author: "MaK & CodeCrust"
tags: ["architecture", "decisions", "adr", "documentation", "governance"]
category: "Architecture"
description: "Overview of architectural decisions and their documentation for the Sourdough Documentation project"
---

# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Sourdough Documentation project. ADRs document the significant architectural and technical decisions made during the development and evolution of this system.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences. ADRs help teams understand why certain decisions were made and provide historical context for future development.

## ADR Format

We use a simple format for our ADRs:

- **Title**: Short descriptive title
- **Status**: Proposed, Accepted, Deprecated, or Superseded
- **Date**: When the decision was made
- **Context**: What is the issue that we're seeing that is motivating this decision or change
- **Decision**: What is the change that we're proposing or have agreed to implement
- **Consequences**: What becomes easier or more difficult to do and any risks introduced

## Index of ADRs

- [ADR-001: MkDocs with Material Theme for Documentation](adr-001-mkdocs-material-theme.md)
- [ADR-002: Docker Containerization Strategy](adr-002-docker-containerization.md)
- [ADR-003: Docker Swarm for Deployment](adr-003-docker-swarm-deployment.md)
- [ADR-004: GitHub Actions for CI/CD](adr-004-github-actions-cicd.md)
- [ADR-005: Private Docker Registry](adr-005-private-docker-registry.md)
- [ADR-006: Self-Hosted GitHub Runner](adr-006-self-hosted-github-runner.md)
- [ADR-007: Document Frontmatter Standards](adr-007-document-frontmatter-standards.md)

## Implementation Plans

### Current Plans
- [Baker Features Implementation Plan](implementation-plan-baker-features.md) - 5 expert-recommended features to enhance the baking experience

## Contributing

When making significant architectural decisions:

1. Create a new ADR file following the numbering sequence
2. Use the template format described above
3. Discuss the decision with the team before marking it as "Accepted"
4. Update this README to include the new ADR in the index