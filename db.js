const pg = require('pg');
const keys = require('./config/keys')

const conString = keys.conString.conString
const client = new pg.Client(conString);

client.connect();

const sync = async() => {
  const sql = `

    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS replies;
    DROP TABLE IF EXISTS letters;
    DROP TABLE IF EXISTS threads;
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

    CREATE TABLE threads(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      sender VARCHAR REFERENCES users (id),
      receiver VARCHAR REFERENCES users (id),
      msgs json[]
    );

    CREATE TABLE replies(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      threadId UUID REFERENCES threads (id),
      sender VARCHAR REFERENCES users (id),
      receiver VARCHAR REFERENCES users (id),
      replyMsg VARCHAR NOT NULL,
      read BOOL DEFAULT 'false'
    );

    INSERT INTO letters(message) VALUES('Welcome!');
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

const createReply = async(threadId, sender, receiver, msg) => {
  const sql = `INSERT INTO replies(threadId, sender, receiver, replyMsg) VALUES($1, $2, $3, $4) returning *`
  const response = await client.query(sql, [threadId, sender, receiver, msg])
  return response.rows[0]
}

const getMyReplies = async(id) => {
  const sql = `SELECT * FROM replies WHERE sender = $1 OR receiver = $1`
  const response = await client.query(sql, [id])
  return response.rows
}

const getReplies = async() => {
  const sql = `SELECT * FROM replies`
  const response = await client.query(sql)
  return response.rows
}

const createThread = async(msgArray, sender, receiver) => {
  const sql = `INSERT INTO threads(msgs, sender, receiver) VALUES($1, $2, $3) returning *`
  const response = await client.query(sql, [msgArray, sender, receiver])
  return response.rows[0]
}

const updateThread = async(msgArray, id) => {
  const sql = `UPDATE threads SET msgs = $1 WHERE id = $2 returning * `
  const response = await client.query(sql, [msgArray, id])
  return response.rows[0]
}

const getThreads = async() => {
  const sql = `SELECT * FROM threads`
  const response = await client.query(sql)
  return response.rows
}

const getThread = async(id) => {
  const sql = `SELECT * FROM threads WHERE id = $1`
  const response = await client.query(sql, [id])
  return response.rows[0]
}

const getSentThreads = async(sender) => {
  const sql = `SELECT * FROM threads WHERE sender = $1`
  const response = await client.query(sql, [sender])
  return response.rows
}

const getReceivedThreads = async(receiver) => {
  const sql = `SELECT * FROM threads WHERE receiver = $1`
  const response = await client.query(sql, [receiver])
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
  getReplies,
  createThread, 
  updateThread,
  getThread,
  getThreads,
  getSentThreads,
  getReceivedThreads
}