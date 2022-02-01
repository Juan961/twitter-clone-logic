const mongoose = require('mongoose')
const { DB_NAME } = require('../config')

const MongoURI = `mongodb://localhost:27017/${DB_NAME}`

async function getConnection () {
  return await mongoose.connect(MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

const isValidId = (id) => {
  return mongoose.Types.ObjectId.isValid(id)
}

module.exports = { getConnection, isValidId }
