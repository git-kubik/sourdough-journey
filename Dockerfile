# Build stage
FROM python:3.11-slim as builder

# Accept build arguments for git information
ARG GIT_COMMIT=unknown
ARG GIT_DATE=unknown

WORKDIR /app

# Install uv for faster dependency management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies using uv
RUN uv pip install --system -r pyproject.toml

# Copy git directory for version info (if it exists)
# Note: In CI, git info is passed via build args

# Copy the rest of the application
COPY mkdocs.yml ./
COPY docs ./docs
COPY inject-git-version.sh ./

# Build the static site with git version injection
RUN chmod +x inject-git-version.sh && \
    GIT_COMMIT=${GIT_COMMIT} GIT_DATE=${GIT_DATE} ./inject-git-version.sh

# Production stage - nginx to serve static files
FROM nginx:alpine

# Copy the built site from builder stage
COPY --from=builder /app/site /usr/share/nginx/html

# Copy custom nginx configuration if needed
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ =404; \
    } \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]