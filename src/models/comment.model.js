const moongose = require('mongoose')

const { Schema } = require('mongoose')

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  retweets: [{
    type: Schema.Types.ObjectId,
    ref: 'Tweet'
  }],
  saved: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]

})

const CommentModel = moongose.model('Comment', CommentSchema)

module.exports = CommentModel
