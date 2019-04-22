FROM keymetrics/pm2:10-jessie

LABEL maintainer="M. Zafer Yahsi <https://github.com/mzaferyahsi>"
LABEL katniss-application=${APP_NAME}
LABEL version=${APP_VERSION}

COPY dist app/
COPY package.json app/
COPY pm2.json .
COPY start.sh .

RUN chmod +x /start.sh

ENV PORT=8001
ENV NPM_CONFIG_LOGLEVEL warn
ENV KAFKA_HOST=kafka

RUN cd app && npm install --production

VOLUME [ "/app/config" ]
EXPOSE 8001

CMD [ "./start.sh" ]
