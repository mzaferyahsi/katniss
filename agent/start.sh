START_APP="pm2-runtime start pm2.json"
WAIT_FOR_KAFKA="./wait-for.sh ${KAFKA_HOST}:9092 -- ${START_APP}"
./wait-for.sh ${LOGSTASH_HOST}:5001 -- "$($WAIT_FOR_KAFKA)"

