require('dotenv').config()

const { DB_NAME, DB_NAME_TEST, NODE_ENV } = process.env

module.exports = {
  DB_NAME: NODE_ENV === 'test' ? DB_NAME_TEST : DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET
}
