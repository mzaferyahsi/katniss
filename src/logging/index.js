/* jshint esversion: 6 */

import Logstash from 'logstash-client';
import config from '../config/config';

export class Logger {
  static getLogger(className) {
    /* istanbul ignore else */
    if(!className)
      throw new Error('Class name not defined!');

    const  client = new Logstash({
      type: 'udp',
      host: config.logging.host,
      port: config.logging.port,
      format: function (message) {
        message['@timestamp'] = new Date();
        message.application = config.application.name;
        message.class = className;
        message.date = new Date();
        /* istanbul ignore else */
        if(message.password)
          message.password = '!FILTERED!';
        return JSON.stringify(message, null, 2);
      }
    });
    return new Logger(client);

  }

  constructor(client) {
    this.client = client;
  }

  log (severity, message, stackTrace) {
    let logMessage = {
      message: message
    };
    if(typeof message === 'object')
      logMessage = message;
      
    logMessage.stackTrace = stackTrace;
    logMessage.severity = severity;
    this.client.send(logMessage);
  }

  logInfo(message) {
    this.log('info', message);
  }

  logWarning(message) {
    this.log('warning', message);
  }

  logError(message, trace) {
    this.log('error', message, trace);
  }

}
