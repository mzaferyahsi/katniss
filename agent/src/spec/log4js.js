/* jshint esversion: 6 */
/* eslint no-unused-vars: "off" */

import * as log4js from 'log4js';

export class TestLog4JConfig {

  static configure (level) {
    if(!level)
      level = 'error';

    log4js.configure({
      'appenders': {
        'out': {
          'type': 'stdout',
          'layout': { 'type': 'basic' }
        }
      },
      'categories': {
        'default': {
          'appenders': [
            'out'
          ],
          'level': level
        }
      }
    });
  }

}
