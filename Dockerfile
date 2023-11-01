# Use debian:stable-slim as the base image
FROM debian:stable-slim

# Install required packages and add NodeSource's GPG key
RUN apt-get update && \
    apt-get install -y ca-certificates curl gnupg git && \
    mkdir -p /etc/apt/keyrings && \
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg

ENV NODE_MAJOR=20

RUN echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list

# Update the package list and install Node.js
RUN apt-get update && \
    apt-get install nodejs -y

# Create a new user 'harsanitizer'
RUN adduser harsanitizer

# Clone the har-sanitizer repository
RUN git clone https://github.com/cloudflare/har-sanitizer.git

# Change ownership of the /har-sanitizer directory to 'harsanitizer'
RUN chown -R harsanitizer:harsanitizer /har-sanitizer

# Switch to 'harsanitizer'
USER harsanitizer

# Change directory to the "har-sanitizer" directory
WORKDIR /har-sanitizer

# Install project dependencies
RUN npm install

# Expose port 3001
EXPOSE 3001

# Set the command to run when the container starts
CMD [ "npm", "run", "dev"]