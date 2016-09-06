const ES = require('elasticsearch');
const config = require('../applicationContext');

const esConfig = config.get('es');

const ESClient = new ES.Client({
    host: [esConfig.host, esConfig.port].join(':')
});

ESClient.ping({
        requestTimeout: Infinity,
        hello: "Elasticsearch!"
    },
    function (error) {
        if (error) {
            console.trace('ElasticSearch cluster is down!');
            process.exit(1);
        } else {
            console.log('ElasticSearch is available');
        }
    });

module.exports = ESClient;
