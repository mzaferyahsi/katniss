/* jshint esversion: 6 */

import * as log4js from 'log4js';

let logger;

export class HeartBeatRoute {

  static get logger() {
    /* istanbul ignore else */
    if(!logger) {
      logger = log4js.getLogger();
      logger.addContext('source', 'HeartBeatRoute');
    }

    return logger;
  }

  static handleGet (request, response) {
    response.status(200).json({
      message: 'OK'
    });
    HeartBeatRoute.logger.debug('Request handled with 200');
  }

  static configure(router) {
    router.get('/heartbeat', HeartBeatRoute.handleGet);
    HeartBeatRoute.logger.debug('Heartbeat configured.');
  }
}
