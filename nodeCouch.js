const redis = require('redis'),
    async = require('async'),
    config = require('./applicationContext');

const cacheConfig = config.get('cache');

var CouchAdapter = {
    /**
     *
     * @param dbConfig
     * @param router
     */
    dbDriver: function (dbConfig, router) {
        var self = this;
        var _connectionInstance = null;
        var _router = router;
        var _cache = null;
        this.feeds = {};


        this.connect = function (callback) {

            async.series([
                    function (next) {
                        _cache = redis.createClient(cacheConfig.port, cacheConfig.host);
                        _cache.on('error', function (err) {
                            console.trace('Error connecting to redis', err);
                            process.exit(1);
                        });
                        _cache.on('connect', function () {
                            console.log('Redis is available');
                            next();
                        });
                    },
                    function (next) {
                        _connectionInstance = require('./services/db').conn;
                        _connectionInstance.database(config.get('connectionTestDb'))
                            .exists(function (err, exists) {
                                if (exists) {
                                    console.log('CouchDB is available');
                                } else {
                                    console.trace('CouchDB is not available', err ? err : '');
                                    process.exit(1);
                                }
                            });
                        next();
                    }
                ],
                function (err) {
                    callback(err, _connectionInstance);
                });
        };

        this.initListener = function (dataBaseName) {
            var dataBase = _connectionInstance.database(dataBaseName);
            return _cache.get(dataBaseName, function (error, reply) {
                console.info('cache entry ', dataBaseName, error ? error : reply);
                var counter = reply ? Number(reply) : 0;
                startListener(dataBase, counter, dataBaseName);
            });
        };

        this.destroyListener = function (databaseName) {
            var feed = self.feeds[databaseName];
            if (feed.dead) {
                delete self.feeds[databaseName];
            }
        };

        var startListener = function (dataBase, since, storeId) {
            var feed = dataBase.changes({
                since: since,
                include_docs: true
            });

            self.feeds[storeId] = feed;

            feed.on('error', function (error) {
                console.warn('error in feed ', error);
                console.info('terminating monitor ');
                return process.exit();
            });

            feed.on('change', function (change) {
                _cache.set(storeId, change.seq);
                _router(change, storeId, feed);
            });

            console.info(new Date().toUTCString(), 'init listener', storeId);
            return feed;
        };
    }
};

module.exports = CouchAdapter;
