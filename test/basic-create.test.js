const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const sqlite3 = require('sqlite3').verbose();
const { doStuffAndReturnRowCount } = require('../src/basic_transaction');

const { expect } = Code;
const { it } = exports.lab = Lab.script();

it('can create a table and insert rows', async () => {
  let conn = new sqlite3.Database(":memory:");
  const rowCount = await doStuffAndReturnRowCount(conn);
  expect(rowCount).to.equal(10);
});
