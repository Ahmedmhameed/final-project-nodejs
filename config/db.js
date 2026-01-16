const { MongoClient } = require("mongodb");
const _uri = process.env.MONGODB_URI;

const dbConnection = (collection, cb) => {
  MongoClient.connect(_uri)
    .then(async (client) => {
      const db = client.db(process.env.MONGODB_dB_NAME).collection(collection);
      await cb(db);
      client.close();
    })
    .catch();
};

// test Connection
dbConnection("articals", async (db) => {
  const articals = await db.findOne();
  console.log(articals);
});

module.exports = dbConnection;
