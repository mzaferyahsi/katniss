/* jshint esversion: 6 */

import Logstash from 'logstash-client';
import config from '../config/config';

export const LogLevel = {
  Debug: 0,
  Info: 1,
  Warning: 2,
  Error: 3,
  Fatal: 4
};

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
    this.level = LogLevel[config.logging.level];
  }

  log (severity, message, stackTrace) {
    if (severity < this.level)
      return;

    let logMessage = {
      message: message
    };
    if(typeof message === 'object')
      logMessage = message;
      
    logMessage.stackTrace = stackTrace;
    logMessage.severity = severity;
    this.client.send(logMessage);
  }

  logDebug(message) {
    this.log(LogLevel.Debug, message);
  }

  logInfo(message) {
    this.log(LogLevel.Info, message);
  }

  logWarning(message) {
    this.log(LogLevel.Warning, message);
  }

  logError(message, trace) {
    this.log(LogLevel.Error, message, trace);
  }

  logFatal(message, trace) {
    this.log(LogLevel.Fatal, message, trace);
  }

}
