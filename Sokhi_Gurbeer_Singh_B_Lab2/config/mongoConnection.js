const MongoClient = require("mongodb").MongoClient;
const settings = {
  mongoConfig: {
    serverUrl:
      "mongodb://localhost:27017",
    database: "Sokhi-Gurbeer-Singh-CS554-Lab2",
  },
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
    });
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

module.exports= {dbConnection, closeConnection};
