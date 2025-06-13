# GitHub Secrets Setup for CI/CD

This document explains how to configure GitHub repository secrets for secure Docker registry authentication.

## Required Secrets

The GitHub Actions workflow requires the following repository secrets to be configured:

### Docker Registry Credentials
- **`REGISTRY_USERNAME`**: Username for the Docker registry (from DOCKER_REGISTRY_USAGE.md)
- **`REGISTRY_PASSWORD`**: Password for the Docker registry (from DOCKER_REGISTRY_USAGE.md)

## Setting Up GitHub Secrets

### Method 1: GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your GitHub repository: https://github.com/git-kubik/sourdough-journey
   - Click on "Settings" tab
   - In the left sidebar, click "Secrets and variables" → "Actions"

2. **Add Registry Username**
   - Click "New repository secret"
   - Name: `REGISTRY_USERNAME`
   - Secret: `admin` (as documented in DOCKER_REGISTRY_USAGE.md)
   - Click "Add secret"

3. **Add Registry Password**
   - Click "New repository secret"
   - Name: `REGISTRY_PASSWORD`
   - Secret: `admin123` (as documented in DOCKER_REGISTRY_USAGE.md)
   - Click "Add secret"

### Method 2: GitHub CLI

If you have GitHub CLI installed and authenticated:

```bash
# Set registry username
gh secret set REGISTRY_USERNAME --body "admin" --repo git-kubik/sourdough-journey

# Set registry password
gh secret set REGISTRY_PASSWORD --body "admin123" --repo git-kubik/sourdough-journey
```

### Method 3: Using Environment Variables

For automated setup, you can use environment variables:

```bash
# Set environment variables
export REGISTRY_USERNAME="admin"
export REGISTRY_PASSWORD="admin123"

# Create secrets using GitHub CLI
echo "$REGISTRY_USERNAME" | gh secret set REGISTRY_USERNAME --repo git-kubik/sourdough-journey
echo "$REGISTRY_PASSWORD" | gh secret set REGISTRY_PASSWORD --repo git-kubik/sourdough-journey
```

## Verification

### Check Secrets Are Set
```bash
# List repository secrets
gh secret list --repo git-kubik/sourdough-journey
```

Expected output:
```
REGISTRY_PASSWORD  Updated YYYY-MM-DD
REGISTRY_USERNAME  Updated YYYY-MM-DD
```

### Test in Workflow
Once secrets are configured, the next push to the main branch will:
1. Use the secrets for Docker registry authentication
2. Build and push the Docker image
3. Deploy to Docker Swarm

## Security Best Practices

### Secret Management
- **Never commit credentials to code**: Always use GitHub secrets for sensitive data
- **Rotate credentials regularly**: Update both registry passwords and GitHub secrets
- **Limit secret access**: Only necessary workflows should have access to secrets
- **Monitor secret usage**: Review GitHub Actions logs for any authentication issues

### Credential Rotation
When registry credentials change:

1. **Update Registry Password** (on registry host):
   ```bash
   ssh m@10.9.8.120
   sudo /etc/docker/creds/rotate-credentials.sh <new-password>
   ```

2. **Update GitHub Secret**:
   ```bash
   gh secret set REGISTRY_PASSWORD --body "<new-password>" --repo git-kubik/sourdough-journey
   ```

3. **Verify Update**:
   - Trigger a new workflow run by pushing to main branch
   - Check that authentication succeeds in workflow logs

## Troubleshooting

### Common Issues

#### Secret Not Found
```
Error: Secret REGISTRY_USERNAME not found
```
**Solution**: Verify the secret name matches exactly (case-sensitive)

#### Authentication Failed
```
Error: unauthorized: authentication required
```
**Solution**: 
1. Verify secret values match the registry credentials
2. Check that registry is accessible from runner
3. Ensure registry is running on 10.9.8.121:5000

#### Permission Denied
```
Error: denied: requested access to the resource is denied
```
**Solution**:
1. Verify registry credentials are correct
2. Check registry user permissions
3. Ensure registry allows pushes from the authenticated user

### Debug Steps

1. **Check Secret Availability**:
   ```yaml
   - name: Debug secrets
     run: |
       echo "Username length: ${#REGISTRY_USERNAME}"
       echo "Password length: ${#REGISTRY_PASSWORD}"
   ```

2. **Test Registry Connection**:
   ```bash
   # Test from runner
   curl -X GET http://10.9.8.121:5000/v2/_catalog
   ```

3. **Verify Authentication**:
   ```bash
   # Test login (without exposing password)
   echo "Testing registry authentication..."
   docker login 10.9.8.121:5000 --username "$REGISTRY_USERNAME" --password-stdin
   ```

## Advanced Configuration

### Environment-Specific Secrets
For multiple environments (dev, staging, prod):

```yaml
env:
  REGISTRY_USERNAME: ${{ secrets[format('REGISTRY_USERNAME_{0}', github.ref_name)] }}
  REGISTRY_PASSWORD: ${{ secrets[format('REGISTRY_PASSWORD_{0}', github.ref_name)] }}
```

### Conditional Secret Usage
```yaml
- name: Push to registry
  if: github.event_name == 'push' && github.ref == 'refs/heads/main'
  env:
    REGISTRY_USERNAME: ${{ secrets.REGISTRY_USERNAME }}
    REGISTRY_PASSWORD: ${{ secrets.REGISTRY_PASSWORD }}
  run: |
    if [[ -z "$REGISTRY_USERNAME" || -z "$REGISTRY_PASSWORD" ]]; then
      echo "⚠️ Registry credentials not configured"
      exit 1
    fi
    # ... rest of push logic
```

---

**Security Note**: This documentation references credential values from DOCKER_REGISTRY_USAGE.md. In a production environment, these should be strong, unique passwords that are rotated regularly.