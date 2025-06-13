# Docker Setup for Sourdough Documentation

This documentation site is packaged as a Docker container and automatically deployed via GitHub Actions.

## Architecture

- **Build**: Multi-stage Docker build using Python to build MkDocs site and nginx:alpine to serve
- **Registry**: Private Docker registry at `10.9.8.121:5000`
- **CI/CD**: GitHub Actions workflow triggers on commits to main branch

## Local Development

### Build the Docker image
```bash
docker build -t sourdough-docs:local .
```

### Run locally
```bash
docker run -d -p 8080:80 sourdough-docs:local
# Visit http://localhost:8080
```

## Manual Registry Push

Use the provided script:
```bash
./scripts/push-to-registry.sh
```

**Note**: You must configure Docker to allow the insecure registry `10.9.8.121:5000` first.

## GitHub Actions CI/CD

The workflow (`.github/workflows/build-and-deploy.yml`) automatically:
1. Builds the Docker image on every push to main
2. Tests the image to ensure nginx starts correctly
3. Pushes to the private registry with tags:
   - `latest` - always points to the most recent main branch build
   - `{commit-sha}-{timestamp}` - unique version identifier

## Docker Registry Configuration

### Linux
Add to `/etc/docker/daemon.json`:
```json
{
  "insecure-registries": ["10.9.8.121:5000"]
}
```
Then restart Docker: `sudo systemctl restart docker`

### macOS
In Docker Desktop settings, add `10.9.8.121:5000` to insecure registries.

## Deployment

Pull and run the latest image:
```bash
docker pull 10.9.8.121:5000/sourdough-docs:latest
docker run -d -p 80:80 10.9.8.121:5000/sourdough-docs:latest
```