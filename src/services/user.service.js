const { getConnection, isValidId } = require('../lib/mongo')
const UserModel = require('../models/user.model')

class UserService {
  async createUser (name, password, email, bio, avatar, background) {
    try {
      await getConnection()

      const exists = await UserModel.findOne({
        email
      })

      if (!exists) {
        const user = await UserModel.create({
          name,
          password,
          email,
          bio,
          avatar,
          background
        })
        return user
      }

      return { message: 'user already exists' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getUserEmail (email) {
    try {
      await getConnection()

      const user = await UserModel.findOne({
        email
      })

      return user
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async getUser (id) {
    try {
      await getConnection()

      if (isValidId(id)) {
        const user = await UserModel.findById(id)
        return user
      }

      return { message: 'error' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async randomUsers () {
    try {
      await getConnection()

      const users = await UserModel.find().limit(4)

      return users
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async follow (idUserFollow, idUserFollowed) {
    try {
      await getConnection()

      if (isValidId(idUserFollow) && isValidId(idUserFollowed)) {
        const follow = await UserModel.findByIdAndUpdate(idUserFollow, {
          $addToSet: {
            following: idUserFollowed
          }
        })
        await UserModel.findByIdAndUpdate(idUserFollowed, {
          $addToSet: {
            followers: idUserFollow
          }
        })

        return follow
      }

      return { message: 'error' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async unfollow (idUserFollow, idUserFollowed) {
    try {
      await getConnection()

      if (isValidId(idUserFollow) && isValidId(idUserFollowed)) {
        const unfollow = await UserModel.findByIdAndUpdate(idUserFollow, {
          $pull: {
            following: idUserFollowed
          }
        })
        await UserModel.findByIdAndUpdate(idUserFollowed, {
          $pull: {
            followers: idUserFollow
          }
        })

        return unfollow
      }

      return { message: 'error' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async search (value) {
    try {
      await getConnection()

      const users = await UserModel.find({
        $or: [
          { name: value },
          { email: value }
        ]

      })

      return users
    } catch (error) {
      console.log(error)
      return { error }
    }
  }

  async deleteUser (id) {
    // Delete tweets, comments, reactions and hashtags
    try {
      await getConnection()

      if (isValidId(id)) {
        const user = await UserModel.findByIdAndDelete(id)
        return user
      }

      return { message: 'error' }
    } catch (error) {
      console.log(error)
      return { error }
    }
  }
}

module.exports = UserService
