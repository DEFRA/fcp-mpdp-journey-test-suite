FROM ghcr.io/zaproxy/zaproxy:stable AS zap-source

FROM node:24-slim

ENV TZ="Europe/London"

USER root

RUN apt-get update -qq \
    && apt-get install -qqy --no-install-recommends \
       curl zip unzip openjdk-17-jre-headless \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=zap-source /zap /zap

WORKDIR /app

COPY package*.json .
RUN npm install
RUN npx playwright install --with-deps chromium firefox webkit

COPY . .

RUN mkdir -p /root/.browserstack \
 && curl -fsSL https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -o /tmp/bs.zip \
 && unzip /tmp/bs.zip -d /root/.browserstack \
 && chmod +x /root/.browserstack/BrowserStackLocal \
 && rm /tmp/bs.zip

ENTRYPOINT [ "./entrypoint.sh" ]
