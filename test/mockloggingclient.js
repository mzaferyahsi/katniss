export class MockLoggingClient {
  constructor (className) {
    this.className = className;
  }
    
  log (severity, message, stackTrace) {
    const date = (new Date()).toISOString().replace('T', ' ').replace('Z', '');
    let errorMessage = message
    if(typeof message === 'object') 
      errorMessage = JSON.stringify(message);
      
    console.log(`${date} ${this.className} ${severity}:${errorMessage}\nStack Trace: ${stackTrace}`);
  }

  logInfo(message) {
    this.log('info', message);
  }

  logWarning(message) {
    this.log('warning', message);
  }

  logError(message, stackTrace) {
    this.log('error', message, stackTrace);
  }
}
