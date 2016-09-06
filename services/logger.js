'use strict';
var config = require('../applicationContext');
const config = config.get('logging');

var formatArgs = function (args) {
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
};

if (config.get('isEnabled')) {

    var util = require('util');

    /* Override default logger statements */
    console.log = function () {
    };

    console.info = function () {
    };

    console.warn = function () {
    };

    console.error = function () {
    };

    console.debug = function () {
    };
}
