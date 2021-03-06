// lets require/import the mongodb native drivers.
let mongodb = require('mongodb');

// We need to work with "MongoClient" interface in order to connect to a mongodb server.
let MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.

let url = 'mongodb://pKumasaka:phraseCrazy6@ds01316.mlab.com:ds121960/phrasecraze';

// Use connect method to connect to the Server
MongoClient.connect(url, (err, db) => {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.

    //Close connection
    db.close();
  }
});
