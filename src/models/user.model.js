const moongose = require('mongoose')

const { Schema } = require('mongoose')

const UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  avatar: {
    type: String,
    default: '/static/images/user_stock.png'
  },
  background: {
    type: String,
    default: '/static/images/back_stock.png'
  },
  bio: String,
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tweets: [{
    type: Schema.Types.ObjectId,
    ref: 'Tweet'
  }]
})

const UserModel = moongose.model('User', UserSchema)

module.exports = UserModel
