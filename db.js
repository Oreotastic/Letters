const pg = require('pg');

const conString = "postgres://gkvozrtq:Uvi4_TPGyJ6Z_pOAyseVV3T71I9QNeKe@drona.db.elephantsql.com:5432/gkvozrtq" //Can be found in the Details page
const client = new pg.Client(conString);

client.connect();

const sync = async() => {
  const sql = `
    DROP TABLE IF EXISTS replies;
    DROP TABLE IF EXISTS letters;
    DROP TABLE IF EXISTS users cascade;
    
    CREATE TABLE users(
      id VARCHAR UNIQUE NOT NULL,
      name VARCHAR NOT NULL
    );

    CREATE TABLE letters(
      id SERIAL UNIQUE,
      userId VARCHAR REFERENCES users (id),
      message VARCHAR(450)
    );

    CREATE TABLE replies(
      id SERIAL,
      ogUserId VARCHAR REFERENCES users (id),
      msgId VARCHAR NOT NULL,
      replyMsg VARCHAR NOT NULL
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
  return response.rows[0]
}

const createMessage = async(msg, userId) => {
  const sql = `INSERT INTO letters(message, userId) VALUES($1, $2)`
  const response = await client.query(sql, [msg, userId])
  return response.rows[0]
}

const getUser = async(id) => {
  const sql = `SELECT * FROM users WHERE id = $1` 
  const response = await client.query(sql, [id])
  return response.rows[0]
}

const createUser = async(id, name) => {
  const existingUser = await getUser(id)
  if(typeof existingUser === 'undefined') {
    const sql = `INSERT INTO users(id, name) VALUES($1, $2) returning *`
    const response = await client.query(sql, [id, name])
    return response.rows[0]
  }
  return existingUser
}

const createReply = async(userId, msgId, msg) => {
  const sql = `INSERT INTO replies(ogUserId, msgId, replyMsg) VALUES($1, $2, $3) returning *`
  const response = await client.query(sql, [userId, msgId, msg])
  return response.rows[0]
}

const getMyReplies = async(id) => {
  const sql = `SELECT * FROM replies WHERE ogUserId = $1`
  const response = await client.query(sql, [id])
  return response.rows
}

const getReplies = async() => {
  const sql = `SELECT * FROM replies`
  const response = await client.query(sql)
  return response.rows
}

module.exports = {
  sync,
  getMessages,
  getMessage,
  createMessage,
  getUser,
  createUser,
  createReply,
  getMyReplies,
  getReplies
}
