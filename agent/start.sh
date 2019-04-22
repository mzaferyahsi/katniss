./wait-for ${LOGSTASH_HOST}:5001 -- ./wait-for ${KAFKA_HOST}:9092 -- pm2-runtime start pm2.json
