const express = require('express')

const usersRouter = require('./users.router')
const tweetsRouter = require('./tweets.router')

function routerApi (app) {
  const router = express.Router()
  app.use('/api', router)
  router.use('/users', usersRouter)
  router.use('/tweets', tweetsRouter)
}

module.exports = routerApi
