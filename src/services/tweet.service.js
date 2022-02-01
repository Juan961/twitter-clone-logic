const { getConnection, isValidId } = require('../lib/mongo')
const TweetModel = require('../models/tweet.model')
const HashtagModel = require('../models/hashtag.model')
const CommentModel = require('../models/comment.model')

class TweetService {
  async createTweet (userId, content) {
    try {
      await getConnection()

      const words = content.split(' ')
      const hashtags = words.filter(word => word.startsWith('#'))

      const tweet = await TweetModel.create({
        user: userId,
        content,
        likes: [],
        retweets: [],
        saved: [],
        createdAt: Date.now()
      })

      for (const hashtag of hashtags) {
        let hashtagModel = await HashtagModel.findOne({
          name: hashtag.slice(1)
        })

        if (hashtagModel) {
          hashtagModel.tweets.push(tweet._id)
          await hashtagModel.save()
        } else {
          hashtagModel = await HashtagModel.create({
            name: hashtag.slice(1),
            tweets: [tweet._id]
          })
        }
      }

      return tweet
    } catch (error) {
      console.log(error)
    }
  }

  async getAllTweets (bookmark) {
    try {
      await getConnection()

      const tweets = await TweetModel.find()

      return tweets
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getTrends () {
    try {
      await getConnection()

      const trends = await HashtagModel.find()
        .sort({ tweets: -1 })
        .limit(10)

      return trends
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getTweetsByUser (id) {
    await getConnection()

    const tweet = await TweetModel.find({
      user: id
    })

    return tweet
  }

  async likeTweet (tweetId, userId) {
    await getConnection()

    const tweet = await TweetModel.findOne({
      _id: tweetId,
      likes: {
        _id: userId
      }
    })

    if (isValidId(tweetId) && isValidId(userId)) {
      if (tweet) {
        const update = await TweetModel.findByIdAndUpdate(tweetId, {
          $pull: {
            likes: userId
          }
        })
        return update
      } else {
        const update = await TweetModel.findByIdAndUpdate(tweetId, {
          $addToSet: {
            likes: userId
          }
        })
        return update
      }
    }

    return { message: 'Invalid id' }
  }

  async retweet (tweetId, userId) {
    try {
      await getConnection()

      if (isValidId(tweetId) && isValidId(userId)) {
        const retweet = await TweetModel.findByIdAndUpdate(tweetId, {
          $addToSet: {
            retweets: userId
          }
        })
        return retweet
      }

      return { message: 'Invalid id' }
    } catch (error) {
      console.log(error)
    }
  }

  async save (tweetId, userId) {
    try {
      await getConnection()

      if (isValidId(tweetId) && isValidId(userId)) {
        const tweet = await TweetModel.findByIdAndUpdate(tweetId, {
          $addToSet: {
            saved: userId
          }
        })
        return tweet
      }

      return { message: 'Invalid id' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getComment (commentId) {
    try {
      await getConnection()

      const comment = await CommentModel.findById(commentId)

      return comment
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async commentOnTweet (tweetId, userId, content) {
    try {
      await getConnection()

      const comment = await CommentModel.create({
        user: userId,
        content: content
      })

      if (isValidId(tweetId)) {
        const tweet = await TweetModel.findByIdAndUpdate(tweetId, {
          $addToSet: {
            comments: comment._id
          }
        })
        return tweet
      }

      return { message: 'Invalid id' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getTweetsByHashtag (hashtag) {
    try {
      await getConnection()

      const tweet = await TweetModel.find({
        hashtags: hashtag
      })

      return tweet
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async verify (idTweet, idUser) {
    try {
      await getConnection()

      const retweet = await TweetModel.findOne({
        _id: idTweet,
        retweets: {
          _id: idUser
        }
      })

      const like = await TweetModel.findOne({
        _id: idTweet,
        likes: {
          _id: idUser
        }
      })

      const save = await TweetModel.findOne({
        _id: idTweet,
        saved: {
          _id: idUser
        }
      })

      return {
        retweet,
        like,
        save
      }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async search (value, type) {
    try {
      await getConnection()

      if (type === 'top') {
        const search = await TweetModel.find({

        })

        return search
      } else if (type === 'lastest') {
        const search = await TweetModel.find({

        })

        return search
      } else {
        const search = await TweetModel.find({

        })

        return search
      }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async bookmarks (user, type) {
    try {
      await getConnection()

      if (type === 'tweets') {
        const search = await TweetModel.find({
          saved: {
            _id: user
          }
        })

        return search
      } else if (type === 'replies') {
        const search = await TweetModel.find({
          saved: user
        })

        return search
      } else if (type === 'media') {
        const search = await TweetModel.find({
          saved: user
        })

        return search
      } else {
        const search = await TweetModel.find({
          likes: {
            _id: user
          }
        })

        return search
      }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async commentLike (idComment, idUser) {
    try {
      await getConnection()

      if (isValidId(idComment) && isValidId(idUser)) {
        const like = await CommentModel.findByIdAndUpdate(idComment, {
          $addToSet: {
            likes: idUser
          }
        })
        return like
      }

      return { message: 'Invalid id' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

module.exports = TweetService
