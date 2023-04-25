#
# Create an intermediate image to build the application that will have devDependencies
#
FROM node:18-alpine as builder

# Update OS packages
RUN apk update && apk upgrade --no-cache

# Create a directory under the node user
RUN mkdir /app && chown node:node /app

# Set the working directory
WORKDIR /app

# Switch to the predefined node use to avoid running as root
USER node

# Copy both package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Run clean install
RUN npm ci \
  # skip funding messages
  --fund false \
  # skip pre/post scripts
  --ignore-scripts \
  # skip vulnerability check
  --no-audit \
  # skip update information
  --no-update-notifier

# Copy the source code
COPY --chown=node:node . /app

# Build the app
RUN npm run build

#
# This will be the image used in production with just the build and prod dependencies
#
FROM node:18-alpine

# Update OS packages
RUN apk update && apk upgrade --no-cache

# Create a directory under the node user
RUN mkdir -p /usr/src/app && chown node:node /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Switch to the predefined node use to avoid running as root
USER node

# Copy both package.json and package-lock.json from the builder image
COPY --from=builder --chown=node:node /app/package*.json ./

# Run clean install
RUN npm ci \
  # skip funding messages
  --fund false \
  # skip pre/post scripts
  --ignore-scripts \
  # skip vulnerability check
  --no-audit \
  # skip update information
  --no-update-notifier \
  # skip dev dependencies
  --omit=dev \
  # rebuild bcrypt
  && npm rebuild bcrypt \
  # attempt to reduce image size
  && npm cache clean --force

# Copy the build from the builder image
COPY --from=builder --chown=node:node /app/dist/ ./dist/

# Run
CMD [ "node", "./dist/index.js" ]
