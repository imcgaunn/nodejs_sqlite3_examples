const sqlite3 = require('sqlite3').verbose();

function doStuffAndReturnRowCount(dbConn) {
  const myProm = new Promise((resolve, reject) => {
    dbConn.serialize(function() {
      dbConn.run("CREATE TABLE example_table(silly_id integer primary key, a TEXT default '[]')");
      const insertStmt = dbConn.prepare("INSERT INTO example_table(silly_id, a) VALUES (?, ?)");
      for (let i = 1; i <= 10; i++) {
        insertStmt.run(i, `[1,2,3,${i}]`);
      }
      insertStmt.finalize();
      dbConn.each("SELECT silly_id id, a FROM example_table", function(err, row) {
        if (err) {
          console.error("something went wrong running query");
          reject(err);
        }
        console.log(row);
      });
      dbConn.get("SELECT count(silly_id) numrows from example_table", function(err, row) {
        if (err) {
          console.error("something went wrong running query");
          reject(err);
        }
        resolve(row.numrows);
      });
    })
  });
  return myProm;
}

function main() {
  const myDb = new sqlite3.Database(":memory:");
  doStuffAndReturnRowCount(myDb)
    .then((count) => console.log(count))
    .catch((err) => console.error(err));
}

module.exports = {
  doStuffAndReturnRowCount,
}
