#!/bin/bash
# Script to inject git version into mkdocs.yml before building

# Get git information (use env vars if provided, otherwise try git commands)
if [ -z "$GIT_COMMIT" ] || [ "$GIT_COMMIT" = "unknown" ]; then
    GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
fi

if [ -z "$GIT_DATE" ] || [ "$GIT_DATE" = "unknown" ]; then
    GIT_DATE=$(git log -1 --format=%cd --date=format:'%Y-%m-%d' 2>/dev/null || date '+%Y-%m-%d')
fi

# Create a backup of original mkdocs.yml
cp mkdocs.yml mkdocs.yml.bak

# Update the copyright line to include version
sed -i "s/^copyright: .*/copyright: \"Copyright \&copy; 2025 MaK \& CodeCrust - Version: ${GIT_COMMIT} (${GIT_DATE})\"/" mkdocs.yml

# Build the site
mkdocs build

# Restore original mkdocs.yml
mv mkdocs.yml.bak mkdocs.yml