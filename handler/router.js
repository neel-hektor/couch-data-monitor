const file = require('fs'),
    path = require('path');


var handler = {
    _routingTable: [],

    registerActions: function () {
        var conditionsDirectory = path.join(__dirname, 'conditions');
        file.readdirSync(conditionsDirectory).forEach(function (file) {
            var routes = require(conditionsDirectory + '/' + file);
            routes.forEach(function (route) {
                var actionList = handler._routingTable[route.recordType.toLowerCase()];
                if (!actionList || actionList.length === 0) {
                    actionList = [];
                }
                actionList = actionList.concat(route.handler);
                handler._routingTable[route.recordType.toLowerCase()] = actionList;
            });
        });
        console.info('Routing table Built');
    },

    router: function (change, storeId, feed) {
        var routeName = change.id;
        if (handler._routingTable[routeName]) {
            var actionList = handler._routingTable[routeName];
            actionList.forEach(function (action) {
                action(change, storeId, feed);
            });
        }
    }
};

module.exports = handler;
