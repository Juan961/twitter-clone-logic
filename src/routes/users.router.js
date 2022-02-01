const express = require('express')
const UserService = require('../services/user.service')
const bcrypt = require('bcrypt')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const isValidToken = require('../middlewares/auth')
const { validToken } = require('../utils')
const { JWT_SECRET } = require('../config/index')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images/')
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split('/')
    const extension = extArray[extArray.length - 1]
    cb(null, file.fieldname + '-' + Date.now() + '.' + extension)
  }
})

const upload = multer({ storage: storage })

const salt = 10

const router = express.Router()
const service = new UserService()

/* ------------------------------- CREATE USER ------------------------------- */

router.post('/', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'background', maxCount: 1 }]), async (req, res) => {
  const { name, password, email, bio } = req.body

  const hash = await bcrypt.hash(password, salt)

  let user

  if (req.files.avatar && req.files.background) {
    const avatarPath = req.files.avatar[0].path.split('\\')
    const backPath = req.files.background[0].path.split('\\')

    const avatarName = avatarPath[avatarPath.length - 1]
    const backName = backPath[backPath.length - 1]

    user = await service.createUser(name, hash, email, bio, `/static/images/${avatarName}`, `/static/images/${backName}`)
  } else if (req.files.avatar) {
    const avatarPath = req.files.avatar[0].path.split('\\')

    const avatarName = avatarPath[avatarPath.length - 1]

    user = await service.createUser(name, hash, email, bio, `/static/images/${avatarName}`, undefined)
  } else if (req.files.background) {
    const backPath = req.files.background[0].path.split('\\')

    const backName = backPath[backPath.length - 1]

    user = await service.createUser(name, hash, email, bio, undefined, `/static/images/${backName}`)
  } else {
    user = await service.createUser(name, hash, email, bio, undefined, undefined)
  }

  res.status(201).json(user)
})

/* ------------------------------- UPDATE ACCOUNT USER ------------------------------- */

router.patch('/', async (req, res) => {
  const { name, password, email, bio, avatar, background } = req.body

  const hash = await bcrypt.hash(password, salt)

  const user = await service.updateUser(name, hash, email, bio, avatar, background)

  res.status(200).json(user)
})

/* ------------------------------- LOGIN ------------------------------- */

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (email && password) {
    const user = await service.getUserEmail(email)

    if (user) {
      const result = await bcrypt.compare(password, user.password)

      if (result) {
        const access = jwt.sign({
          token_type: 'access',
          id_user: user._id
        }, JWT_SECRET, { expiresIn: '5m' })

        const refresh = jwt.sign({
          token_type: 'refresh',
          id_user: user._id
        }, JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({
          access,
          refresh
        })
      } else {
        res.status(401).json({
          error: 'Wrong password'
        })
      }
    } else {
      res.status(404).json({
        error: 'User not found'
      })
    }
  } else {
    res.status(400).json({
      message: 'bad request'
    })
  }
})

/* ------------------------------- REFRESH TOKENS ------------------------------- */

router.post('/refresh', (req, res) => {
  /* eslint-disable camelcase */
  const { refresh_token } = req.body

  const decoded = validToken(refresh_token, JWT_SECRET)

  const newAccess = jwt.sign({
    token_type: 'access',
    id_user: decoded.id_user
  }, JWT_SECRET, { expiresIn: '5m' })

  const newRefresh = jwt.sign({
    token_type: 'refresh',
    id_user: decoded.id_user
  }, JWT_SECRET, { expiresIn: '1d' })

  res.status(200).json({
    access: newAccess,
    refresh: newRefresh
  })
})

/* ------------------------------- GET LOGED USER BY JWT ------------------------------- */

router.get('/', async (req, res) => {
  const bearer = req.headers.authorization

  const token = bearer.substr(7)

  const decoded = validToken(token, JWT_SECRET)
  const user = await service.getUser(decoded.id_user)

  res.status(200).json({
    user
  })
})

/* ------------------------------- GET RANDOM USERS TO FOLLOW ------------------------------- */

router.get('/random', async (req, res) => {
  const users = await service.randomUsers()

  res.status(200).json({
    users
  })
})

/* ------------------------------- FOLLOW USER ------------------------------- */

router.post('/follow', async (req, res) => {
  const { idUserFollow, idUserFollowed } = req.body // OJO CON ESTO EN LAS PETICIONES

  const follow = await service.follow(idUserFollow, idUserFollowed)

  res.status(200).json({
    follow
  })
})

/* ------------------------------- UNFOLLOW USER ------------------------------- */

router.post('/unfollow', async (req, res) => {
  const { idUserFollow, idUserFollowed } = req.body // OJO CON ESTO EN LAS PETICIONES

  const unfollow = await service.unfollow(idUserFollow, idUserFollowed)

  res.status(200).json({
    unfollow
  })
})

/* ------------------------------- SEARCH USER ------------------------------- */

router.get('/search', isValidToken, async (req, res) => {
  const { value } = req.query

  const result = await service.search(value)

  res.json({
    result
  })
})

/* ------------------------------- DELETE USER ------------------------------- */

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const user = await service.deleteUser(id)

  if (user.message === 'error') {
    res.status(404).json(user)
  } else {
    res.status(204).json(user)
  }
})

/* ------------------------------- GET USER BY ID ------------------------------- */

router.get('/:id', async (req, res) => {
  const { id } = req.params

  const user = await service.getUser(id)

  res.status(200).json({
    user
  })
})

/* ------------------------------- GET USER FOLLOWERS ------------------------------- */

router.get('/followers/:id', async (req, res) => {
  const { id } = req.params

  const followers = await service.getFollowers(id)

  res.status(200).json({
    followers
  })
})

/* ------------------------------- GET USER FOLLOWING ------------------------------- */

router.get('/following/:id', async (req, res) => {
  const { id } = req.params

  const following = await service.getFollowing(id)

  res.status(200).json({
    following
  })
})

module.exports = router
