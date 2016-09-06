# couch-data-monitor
[Couchdb](http://couchdb.apache.org/) is NO-SQL database that provides an HTTP interface for querying data. Couchdb is preferred for syncronisation of data between Offline first Apps and the server.
The documents uploaded into Couchdb can be accessed in terms of change object using [ Change Stream ](http://docs.couchdb.org/en/stable/api/database/changes.html)

# Monitor 
The Couch data monitor is Job triggering service which can used to start processing jobs whenever 
certain type of document is edited / deleted into the database.

Suppose 'order_2_1111' document is inserted into database , we can define a custom job that is to be triggered
when ever 'order' type document is edited / deleted. 

# Handler
In order to create a job for a particular document type , add a new file order.js to handlers/conditions with the following information 

```javascript
const orderProcessor = require('../actions/orderProcessor');
module.exports = [
    {
        recordType: 'order',
        handler: orderProcessor
    }
];
```

similarly declare a handler can be defined as orderProcessor.js in handler/actions which can process the changes made to the document 
```javascript
let run = function (change, storeId) {
    console.log('job triggered');
};

module.exports = run;
```
# Requisites
1. Couchdb 
2. Redis 
3. NodeJS v6.0> 
