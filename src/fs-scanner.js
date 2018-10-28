/* jshint esversion: 6 */
/* eslint no-sync: "off" */
const fs = require('fs'),
  fsPromises = fs.promises,
  path = require('path'),
  scanner = {};

function pushArrays (source, items) {
  const toPush = source.concat.apply([], items);
  for (let i = 0, len = toPush.length; i < len; ++i)
    source.push(toPush[i]);
  return source;
}

scanner.resolvePath = (_path) => {
  if (_path[0] === '~')
    return path.join(process.env.HOME, _path.slice(1));

  return path.resolve(path.normalize(_path));
};

scanner.fsExists = (filePath) => new Promise((resolve, reject) => {
  fsPromises.access(filePath, fs.constants.R_OK).then(() => {
    resolve();
  }).catch((err) => {
    return reject(err);
  });
});

scanner.scan = directoryPath => new Promise((resolve, reject) => {
  const resolvedPath = scanner.resolvePath(directoryPath);

  scanner.fsExists(resolvedPath).then(() => {
    fsPromises.lstat(resolvedPath).then(stats => {
      let _filePaths = [];
      _filePaths.push(resolvedPath);

      if (stats.isDirectory())
        scanDirectory(resolvedPath).then(results => {
          _filePaths = pushArrays(_filePaths, results);
          resolve(_filePaths);
        }).catch((err) => {
          reject(err);
        });
      else
        return resolve(_filePaths);

    }).catch((err) => {
      reject(err);
    });
  }).catch((err) => {
    reject(err);
  });

});

function scanDirectory(filePath) {
  return new Promise((resolve, reject) => {
    fsPromises.readdir(filePath).then(subFiles => {
      const subFilePromisses = subFiles.map(subFile => {
        const fullPath = path.join(filePath, subFile);
        return scanner.scan(fullPath).then(subFileScanResults => {
          return subFileScanResults;
        }).catch((err) => {
          throw err;
        });
      });

      Promise.all(subFilePromisses).then((results) => {
        let discovered = [];
        results.forEach(item => {
          discovered = pushArrays(discovered, item);
        });
        resolve(results);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}

module.exports = scanner;
