/* jshint esversion: 6 */
/* eslint no-sync: "off" */
const fs = require('fs'),
  path = require('path'),
  _this = {
    fsPromises: fs.promises
  };

function pushArrays (source, items) {
  const toPush = source.concat.apply([], items);
  for (let i = 0, len = toPush.length; i < len; ++i)
    source.push(toPush[i]);
  return source;
}

function discoverDirectory(filePath) {
  return new Promise((resolve, reject) => {
    _this.fsPromises.readdir(filePath).then(subFiles => {
      const subFilePromisses = subFiles.map(subFile => {
        const fullPath = path.join(filePath, subFile);
        const discover = _this.discover(fullPath);
        discover.then(subFileScanResults => {
          return subFileScanResults;
        });
        /* istanbul ignore next */
        discover.catch((err) => {
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

_this.resolvePath = (_path) => {
  if (_path[0] === '~')
    return path.join(process.env.HOME, _path.slice(1));

  return path.resolve(path.normalize(_path));
};

_this.fsExists = (filePath) => new Promise((resolve, reject) => {
  _this.fsPromises.access(filePath, fs.constants.R_OK).then(() => {
    resolve();
  }).catch((err) => {
    return reject(err);
  });
});

_this.discover = directoryPath => new Promise((resolve, reject) => {
  const resolvedPath = _this.resolvePath(directoryPath);

  _this.fsExists(resolvedPath).then(() => {
    _this.fsPromises.lstat(resolvedPath).then(stats => {
      let _filePaths = [];
      _filePaths.push(resolvedPath);

      if (stats.isDirectory())
        discoverDirectory(resolvedPath).then(results => {
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

module.exports = _this;
