# Multi-stage build: Extract ZAP from official image
FROM ghcr.io/zaproxy/zaproxy:stable AS zap-source

# Main build stage
FROM node:22.13.1-slim

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

RUN npx playwright install --with-deps

# Copy ZAP from the official image
COPY --from=zap-source /zap /zap

WORKDIR /app

COPY . .
RUN npm install

ADD https://dnd2hcwqjlbad.cloudfront.net/binaries/release/latest_unzip/BrowserStackLocal-linux-x64 /root/.browserstack/BrowserStackLocal
RUN chmod +x /root/.browserstack/BrowserStackLocal

ENTRYPOINT [ "./entrypoint.sh" ]

# This is downloading the linux amd64 aws cli. For M1 macs build and run with the --platform=linux/amd64 argument. eg docker build . --platform=linux/amd64
