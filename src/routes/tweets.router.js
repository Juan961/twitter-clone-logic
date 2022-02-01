const express = require('express')
const TweetsService = require('../services/tweet.service')

const router = express.Router()
const service = new TweetsService()

/* ------------------------------- CREATE A TWEET ------------------------------- */

router.post('/', async (req, res) => {
  const { userId, content } = req.body

  const tweet = await service.createTweet(userId, content)

  res.json({
    tweet
  })
})

/* ------------------------------- GET ALL TWEETS ------------------------------- */

router.get('/', async (req, res) => {
  const tweets = await service.getAllTweets()

  res.json({
    tweets
  })
})

/* ------------------------------- SEARCH TWEETS ------------------------------- */

router.get('/search', async (req, res) => {
  try {
    const { value, type } = req.query

    const result = await service.search(value, type)

    res.json({
      result
    })
  } catch (error) {
    res.status(500).json({
      error: 'search'
    })
  }
})

/* ------------------------------- GET BOOKMARKS FROM USER ------------------------------- */

router.get('/bookmarks', async (req, res) => {
  const { user, type } = req.query

  const result = await service.bookmarks(user, type)

  res.json({
    result
  })
})

/* ------------------------------- LIKE TO A COMMENT ------------------------------- */

router.post('/comments/like', async (req, res) => {
  const { idComment, idUser } = req.body

  const result = await service.commentLike(idComment, idUser)

  res.json({
    result
  })
})

/* ------------------------------- GET TRENDS ------------------------------- */

router.get('/trends', async (req, res) => {
  const trends = await service.getTrends()
  res.json({
    trends
  })
})

/* ------------------------------- GET TWEETS WHITH A HASHTAG ------------------------------- */

router.get('/hashtags/:hashtag', async (req, res) => {
  const { hashtag } = req.params

  const tweets = await service.getTweetsByHashtag(hashtag)
  res.json({
    tweets
  })
})

/* ------------------------------- GET COMMENTS OF A TWEET TODO ------------------------------- */

router.get('/:commentId/comments', async (req, res) => {
  const { commentId } = req.params

  const comment = await service.getComment(commentId)

  res.json({
    comment
  })
})

/* ------------------------------- COMMENT A TWEET ------------------------------- */

router.post('/:tweetId/comments', async (req, res) => {
  const { tweetId } = req.params
  const { userId, content } = req.body

  const comment = await service.commentOnTweet(tweetId, userId, content)
  res.status(200).json(comment)
})

/* ------------------------------- RETWEET A TWEET ------------------------------- */

router.post('/:tweetId/retweet', async (req, res) => {
  const { tweetId } = req.params
  const { userId } = req.body

  const tweet = await service.retweet(tweetId, userId)
  res.json({
    tweet
  })
})

/* ------------------------------- SAVE A TWEET ------------------------------- */

router.post('/:tweetId/save', async (req, res) => {
  const { tweetId } = req.params
  const { userId } = req.body

  const tweet = await service.save(tweetId, userId)
  res.json({
    tweet
  })
})

/* ------------------------------- LIKE A TWEET ------------------------------- */

router.post('/:tweetId/like', async (req, res) => {
  const { tweetId } = req.params
  const { userId } = req.body

  const tweet = await service.likeTweet(tweetId, userId)
  res.json({
    tweet
  })
})

/* ------------------------------- VERIFY INTERACTIVITY OF TWEET SINCE USER   ------------------------------- */

router.get('/verify/:idTweet/users/:idUser', async (req, res) => {
  const { idTweet, idUser } = req.params

  const result = await service.verify(idTweet, idUser)

  res.json({
    result
  })
})

/* ------------------------------- GET TWEETS FROM USER ------------------------------- */

router.get('/:userId', async (req, res) => {
  const { userId } = req.params

  const tweets = await service.getTweetsByUser(userId)
  res.json({
    tweets
  })
})

module.exports = router
