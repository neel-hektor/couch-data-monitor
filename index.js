const config = require('./applicationContext');
require('./services/logger');

const dbConfig = config.get('db'),
    crawlRate = config.get('crawlRate'),
    couchClient = require('./nodeCouch'),
    handler = require('./handler/router'),
    dbDriver = new couchClient.dbDriver(dbConfig, handler.router);

let conn = null;

/* Override router function for custom router */
handler.registerActions();

dbDriver.connect(function (err, connection) {
    if (err || !connection) {
        console.trace('application startup failed ', err);
        process.exit(1);
    } else {
        conn = connection;
        enableMonitors();
        setInterval(enableMonitors, crawlRate);
    }
});

/**
 * @description manages the initialization of monitors
 */
var enableMonitors = function () {
    return conn.databases(function (err, databases) {
        if (err) {
            console.trace('failed to connect to DB ', err);
            process.exit(1);
        }
        if (dbDriver.feeds) {
            var existingDbs = Object.keys(dbDriver.feeds);
            removeListeners(databases);
            var newDataBases = [];
            databases.forEach(function (database) {
                if (existingDbs.indexOf(database) === -1) {
                    newDataBases.push(database);
                }
            });
            setupMonitors(newDataBases);
        } else {
            setupMonitors(databases);
        }
    });
};

/**
 * @description removes listeners from db's
 * @param databases - list of databases names whose listener is to be
 * removed
 */
var removeListeners = function (databases) {
    var existingSet = Object.keys(dbDriver.feeds);
    existingSet.forEach(function (item) {
        if (databases.indexOf(item) == -1) {
            dbDriver.destroyListener(item);
        }
    });
};

/**
 * @description removes listeners from db's
 * @param databases list of databases names to which listener is to be
 * added
 */
var setupMonitors = function (databases) {
    databases.forEach(function (database) {
        dbDriver.initListener(database);
    });
};
