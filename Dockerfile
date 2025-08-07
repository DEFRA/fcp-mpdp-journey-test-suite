FROM node:22.13.1-slim

ENV TZ="Europe/London"

USER root

RUN apt-get update -qq \
    && apt-get install -qqy \
    curl \
    zip \
    openjdk-17-jre-headless

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

RUN npx playwright install --with-deps

# RUN curl -L https://github.com/zaproxy/zaproxy/releases/download/v2.16.1/ZAP_2.16.1_Crossplatform.zip -o ZAP_Crossplatform.zip \
#     && unzip ZAP_Crossplatform.zip -d /opt/zap \
#     && rm ZAP_Crossplatform.zip

WORKDIR /app

COPY . .
RUN npm install

# RUN chmod +x /opt/zap/ZAP_2.16.1/zap.sh

ADD https://dnd2hcwqjlbad.cloudfront.net/binaries/release/latest_unzip/BrowserStackLocal-linux-x64 /root/.browserstack/BrowserStackLocal
RUN chmod +x /root/.browserstack/BrowserStackLocal

ENTRYPOINT [ "./entrypoint.sh" ]

# This is downloading the linux amd64 aws cli. For M1 macs build and run with the --platform=linux/amd64 argument. eg docker build . --platform=linux/amd64
