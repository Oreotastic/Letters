const pg = require('pg');

const conString = "postgres://gkvozrtq:Uvi4_TPGyJ6Z_pOAyseVV3T71I9QNeKe@drona.db.elephantsql.com:5432/gkvozrtq" //Can be found in the Details page
const client = new pg.Client(conString);

client.connect();

const sync = async() => {
  const sql = `
    DROP TABLE IF EXISTS letters;

    CREATE TABLE letters(
      id SERIAL,
      message VARCHAR(450)
    );

    INSERT INTO letters(message) VALUES('this is a test :)');
  `

  await client.query(sql)
}

const getMessages = async() => {
  const sql = `SELECT * FROM letters`
  const response = await client.query(sql)
  return response.rows
}

const getMessage = async(id) => {
  const sql = `SELECT * FROM letters WHERE id = $1`
  const response = await client.query(sql, [id])
  console.log(response.rows[0])
  return response.rows[0]
}

const createMessage = async(msg) => {
  const sql = `INSERT INTO letters(message) VALUES($1)`
  const response = await client.query(sql, [msg])
  console.log(response.rows)
  return response.rows[0]
}

module.exports = {
  sync,
  getMessages,
  getMessage,
  createMessage
}
