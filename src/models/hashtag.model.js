const moongose = require('mongoose')

const { Schema } = require('mongoose')

const HashtagSchema = new Schema({
  name: String,
  tweets: [{
    type: Schema.Types.ObjectId,
    ref: 'Tweet'
  }]

})

const HashtagModel = moongose.model('Hashtag', HashtagSchema)

module.exports = HashtagModel
