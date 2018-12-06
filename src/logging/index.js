/* jshint esversion: 6 */

import Logstash from 'logstash-client';
import config from '../config/config';

export class Logger {

  static getLogger({ className = null, client = null } = {}) {
    /* istanbul ignore else */
    if(!className)
      throw new Error('Class name not defined!');

    /* istanbul ignore else */
    if(client)
      return new Logger(new client({ className : className }));
    else {
      client = new Logstash({
        type: 'udp',
        host: config.logging.host,
        port: config.logging.port,
        format: function (message) {
          message['@timestamp'] = new Date();
          message.application = config.application.name;
          message.class = className;
          message.date = new Date();
          message.password = '!FILTERED!';
          return JSON.stringify(message, null, 2);
        }
      });
      return new Logger(client);
    }

  }

  constructor(client) {
    this.client = client;
  }

  log (severity, message) {
    this.client.send({
      message: message,
      level: severity
    });
  }

  logInfo(message) {
    this.log('info', message);
  }

  logWarning(message) {
    this.log('warning', message);
  }

  logError(message) {
    this.log('error', message);
  }

}
