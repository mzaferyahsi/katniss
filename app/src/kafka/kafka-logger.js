/* jshint esversion: 6 */
import kafkaLogging from 'kafka-node/logging';
import log4js from 'log4js';

export class KafkaLog4JsLogger {
  constructor() {
    this.logger = log4js.getLogger();
    this.logger.addContext('source', 'Kafka');

    this.debug = this.logger.debug.bind(this.logger);
    this.info = this.logger.info.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
  }
}

function kafkaLog4JsLogger() {
  return new KafkaLog4JsLogger();
}

kafkaLogging.setLoggerProvider(kafkaLog4JsLogger);
