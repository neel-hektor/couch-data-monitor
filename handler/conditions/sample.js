const sampleJob = require('../actions/sampleJob');

module.exports = [
    {
        recordType: 'sampleRecord',
        handler: sampleJob
    }
];