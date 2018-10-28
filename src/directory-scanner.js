/* jshint esversion: 6 */
/* eslint no-sync: "off" */
const fs = require('fs'),
  path = require('path'),
  scanner = {};


scanner.resolvePath = (_path) => {
  if (_path[0] === '~') 
    return path.join(process.env.HOME, _path.slice(1));
  
  return path.resolve(path.normalize(_path));
};

scanner.scan = directoryPath => new Promise((resolve, reject) => {
  const resolvedPath = scanner.resolvePath(directoryPath);

  if (!fs.existsSync(resolvedPath)) 
    return reject(new Error('File does not exists.'));
  

  return resolve([resolvedPath]);
});

module.exports = scanner;
