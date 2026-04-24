# Multi-stage build: Extract ZAP from official image
FROM ghcr.io/zaproxy/zaproxy:stable AS zap-source

# Main build stage
FROM node:24-slim

ENV TZ="Europe/London"

USER root

RUN apt-get update -qq \
    && apt-get install -qqy curl zip openjdk-17-jre-headless \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy ZAP from the official image
COPY --from=zap-source /zap /zap

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package*.json .
RUN npm install

# Install Playwright browsers after npm install to ensure version compatibility
RUN npx playwright install --with-deps

# Copy the rest of the test code
COPY . .

# ADD https://dnd2hcwqjlbad.cloudfront.net/binaries/release/latest_unzip/BrowserStackLocal-linux-x64 /root/.browserstack/BrowserStackLocal
# RUN chmod +x /root/.browserstack/BrowserStackLocal

RUN mkdir -p /root/.browserstack \
 && curl -fsSL https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -o /tmp/bs.zip \
 && unzip /tmp/bs.zip -d /root/.browserstack \
 && chmod +x /root/.browserstack/BrowserStackLocal \
 && rm /tmp/bs.zip

ENTRYPOINT [ "./entrypoint.sh" ]
