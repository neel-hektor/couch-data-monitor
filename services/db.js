const cradle = require('cradle');
let config = require('../applicationContext');
config = config.get('dbConfig');

cradle.setup({
    host: config.host,
    port: config.port,
    cache: false,
    raw: false,
    stale: 'ok',
    forceSave: true,
    auth: {
        username: config.username,
        password: config.password
    },
    retries: config.retries,
    retryTimeout: config.retryTimeout
});

var conn = new (cradle.Connection)();

module.exports = {
    conn: conn
};
