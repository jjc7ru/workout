const Client = require("pg").Client;

async function dbQuery(statement, ...parameters) {
  let client = new Client({ database: 'exercise-groups' });
  await client.connect();
  let result = await client.query(statement, parameters);
  await client.end();
  return result;
}

module.exports = dbQuery;