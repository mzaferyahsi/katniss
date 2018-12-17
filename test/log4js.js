import * as log4js from 'log4js';


function configure() {
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
        'level': 'debug'
      }
    }
  });
}
