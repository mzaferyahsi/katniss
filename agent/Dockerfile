FROM keymetrics/pm2:10-jessie

LABEL maintainer="M. Zafer Yahsi <https://github.com/mzaferyahsi>"
LABEL katniss-application=${APP_NAME}
LABEL version=${APP_VERSION}

COPY dist app/
COPY package.json app/
COPY pm2.json .

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL warn

RUN cd app && npm install --production

RUN ls -al -R

VOLUME [ "/app/config" ]
EXPOSE 8080

CMD [ "pm2-runtime", "start", "pm2.json" ]