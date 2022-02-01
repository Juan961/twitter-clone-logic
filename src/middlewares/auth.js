const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

const isValidToken = (req, res, next) => {
  const bearer = req.headers.authorization

  if (!bearer) {
    return res.json({
      error: 'No token provided'
    })
  }

  const token = bearer.substr(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log(decoded)
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res.json({
        error: 'Token expired'
      })
    }
  }

  next()
}

module.exports = isValidToken
