let nconf = require('nconf');
let fs = require('fs');
let path = require('path');

let startup = nconf
    .argv()
    .env({separator: '__'});

startup.remove('env');
startup.remove('argv');
startup.remove('defaults');
startup = null;

var configFile = path.resolve('config');

var applicationConfiguration = nconf
    .overrides({})
    .argv()
    .env({separator: '__'});

if (fs.existsSync(configFile)) {
    if (fs.statSync(configFile).isDirectory()) {
        fs
            .readdirSync(configFile)
            .filter(function (file) {
                return (/\.json$/).test(file);
            })
            .forEach(function (file) {
                var filepath = path.normalize(path.join(configFile, file));
                applicationConfiguration = applicationConfiguration.file(file, filepath);
            })
    } else {
        applicationConfiguration = applicationConfiguration.file(configFile);
    }
}

module.exports = applicationConfiguration;