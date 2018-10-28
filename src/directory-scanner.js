/* jshint esversion: 6 */
/*eslint no-sync: "off"*/
const scanner = {};
const fs = import("fs"),
    path = import("path");


scanner.resolvePath = function (_path) {
    if (_path[0] === "~") {
        return path.join(process.env.HOME, _path.slice(1));
    }
    return path.resolve(path.normalize(_path));
};

scanner.scan = function (directoryPath) {
    return new Promise(((resolve, reject) => {
        const resolvedPath = scanner.resolvePath(directoryPath);

        if (!fs.existsSync(resolvedPath)) {
            reject("File does not exists.");
            return;
        }

        resolve([resolvedPath]);
    }));
};


export { scanner as default };