/* jshint esversion: 6 */

const _this = {
    fsScanner: require('../scanners/fs-scanner')
  },
  uuid = require('uuid/v4');

_this.discover = path => {
  const id = uuid();

  _this.fsScanner.discover(path).then((paths) => {
    console.log(JSON.stringify(paths));
    //TODO: Push paths to Kafka
  }).catch((error) => {
    console.log(error);
    //TODO: Push errors to Kafka
  });

  return id;
};

module.exports = _this;
