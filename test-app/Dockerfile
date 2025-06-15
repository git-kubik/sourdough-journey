FROM alpine:latest

# Install basic tools
RUN apk add --no-cache curl

# Create a simple test script
RUN echo '#!/bin/sh' > /test.sh && \
    echo 'echo "Hello from Docker Registry Test!"' >> /test.sh && \
    echo 'echo "Image: $IMAGE_NAME"' >> /test.sh && \
    echo 'echo "Registry: $REGISTRY_URL"' >> /test.sh && \
    echo 'date' >> /test.sh && \
    chmod +x /test.sh

# Set environment variables
ENV IMAGE_NAME="test-app" \
    REGISTRY_URL="10.9.8.122:5000"

CMD ["/test.sh"]