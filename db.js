const pg = require('pg');

const conString = "postgres://gkvozrtq:Uvi4_TPGyJ6Z_pOAyseVV3T71I9QNeKe@drona.db.elephantsql.com:5432/gkvozrtq" //Can be found in the Details page
const client = new pg.Client(conString);

client.connect();

const sync = async() => {
  const sql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS letters;

    CREATE TABLE letters(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      message VARCHAR(450)
    )
  `

  await client.query(sql)
}



module.exports = {
  sync
}
