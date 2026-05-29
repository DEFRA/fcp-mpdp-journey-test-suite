# Multi-stage build: Extract ZAP from official image
FROM ghcr.io/zaproxy/zaproxy:stable AS zap-source

# Main build stage
FROM mcr.microsoft.com/playwright:v1.59.1

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

# Copy the rest of the test code
COPY . .

# Install BrowserStack Local binary to avoid needing to download it at runtime through CDP proxy
RUN mkdir -p /root/.browserstack \
 && curl -fsSL https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -o /tmp/bs.zip \
 && unzip /tmp/bs.zip -d /root/.browserstack \
 && chmod +x /root/.browserstack/BrowserStackLocal \
 && rm /tmp/bs.zip

ENTRYPOINT [ "./entrypoint.sh" ]
