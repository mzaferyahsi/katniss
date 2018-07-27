/*jshint esversion: 6 */
(function() {
    var scanner = {};
    const fs = require('fs');
    const path = require('path');

    scanner.resolvePath = function(_path) {
        if (_path[0] === '~') {
            return path.join(process.env.HOME, _path.slice(1));
        }
        return path.resolve(path.normalize(_path));

    };

    scanner.scan = function(directoryPath) {
        return new Promise(function(resolve, reject) {
            var resolvedPath = scanner.resolvePath(directoryPath);
            
            if(!fs.existsSync(resolvedPath)) {
                reject("File does not exists.");
                return;
            }

            resolve([resolvedPath]);
        });
    };
    
    module.exports = scanner;
}).call(this);