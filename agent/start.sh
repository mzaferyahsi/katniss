./app/node_modules/wait-for/wait-for ${KAFKA_HOST}:9092 -- ./app/node_modules/wait-for/wait-for ${LOGSTASH_HOST}:5001 -- pm2-runtime start pm2.json
