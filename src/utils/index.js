const jwt = require('jsonwebtoken')

function validToken (token, secret) {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (error) {
    if (error.message === 'jwt expired') {
      return {
        error: 'Token expired'
      }
    } else {
      return {
        error: 'Token invalid'
      }
    }
  }
}

module.exports = { validToken }
